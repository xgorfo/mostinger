from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.post import Post, Comment, PostLike, Favorite
from ..schemas.post import PostCreate, PostResponse, CommentCreate, CommentResponse
from ..api.deps import get_current_active_user
from ..core.cache import get_cache, set_cache, delete_cache

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    new_post = Post(
        user_id=current_user.id,
        title=post_data.title,
        content=post_data.content,
        status="published"
    )
    
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    # Invalidate posts cache
    delete_cache("posts:*")
    
    return PostResponse(
        **new_post.__dict__,
        author_username=current_user.username,
        likes_count=0,
        comments_count=0,
        is_liked=False,
        is_favorited=False
    )


@router.get("/", response_model=List[PostResponse])
def get_posts(
    search: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    # Create cache key
    cache_key = f"posts:search:{search}:skip:{skip}:limit:{limit}"
    
    # Try to get from cache
    cached_data = get_cache(cache_key)
    if cached_data:
        return cached_data
    
    query = db.query(Post).filter(Post.status == "published")
    
    # Full-text search
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Post.title.ilike(search_filter)) | 
            (Post.content.ilike(search_filter))
        )
    
    posts = query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    result = []
    for post in posts:
        author = db.query(User).filter(User.id == post.user_id).first()
        likes_count = db.query(PostLike).filter(PostLike.post_id == post.id).count()
        comments_count = db.query(Comment).filter(Comment.post_id == post.id).count()
        
        post_data = PostResponse(
            **post.__dict__,
            author_username=author.username if author else "Unknown",
            likes_count=likes_count,
            comments_count=comments_count,
            is_liked=False,
            is_favorited=False
        )
        result.append(post_data)
    
    # Cache the result (5 minutes)
    set_cache(cache_key, [p.dict() for p in result], ttl=300)
    
    return result


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    author = db.query(User).filter(User.id == post.user_id).first()
    likes_count = db.query(PostLike).filter(PostLike.post_id == post.id).count()
    comments_count = db.query(Comment).filter(Comment.post_id == post.id).count()
    
    return PostResponse(
        **post.__dict__,
        author_username=author.username if author else "Unknown",
        likes_count=likes_count,
        comments_count=comments_count,
        is_liked=False,
        is_favorited=False
    )


@router.post("/{post_id}/like", status_code=status.HTTP_201_CREATED)
def like_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    existing_like = db.query(PostLike).filter(
        PostLike.post_id == post_id,
        PostLike.user_id == current_user.id
    ).first()
    
    if existing_like:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already liked")
    
    new_like = PostLike(post_id=post_id, user_id=current_user.id)
    db.add(new_like)
    db.commit()
    
    return {"message": "Post liked"}


@router.delete("/{post_id}/like", status_code=status.HTTP_200_OK)
def unlike_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    like = db.query(PostLike).filter(
        PostLike.post_id == post_id,
        PostLike.user_id == current_user.id
    ).first()
    
    if not like:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Like not found")
    
    db.delete(like)
    db.commit()
    
    return {"message": "Post unliked"}


@router.post("/{post_id}/favorite", status_code=status.HTTP_201_CREATED)
def favorite_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    existing_favorite = db.query(Favorite).filter(
        Favorite.post_id == post_id,
        Favorite.user_id == current_user.id
    ).first()
    
    if existing_favorite:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already favorited")
    
    new_favorite = Favorite(post_id=post_id, user_id=current_user.id)
    db.add(new_favorite)
    db.commit()
    
    return {"message": "Post favorited"}


@router.delete("/{post_id}/favorite", status_code=status.HTTP_200_OK)
def unfavorite_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    favorite = db.query(Favorite).filter(
        Favorite.post_id == post_id,
        Favorite.user_id == current_user.id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Post unfavorited"}


@router.get("/{post_id}/comments", response_model=List[CommentResponse])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.desc()).all()
    result = []
    for comment in comments:
        author = db.query(User).filter(User.id == comment.user_id).first()
        result.append(CommentResponse(
            **comment.__dict__,
            author_username=author.username if author else "Unknown"
        ))
    return result


@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    new_comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        content=comment_data.content
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    return CommentResponse(
        **new_comment.__dict__,
        author_username=current_user.username
    )