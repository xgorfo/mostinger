from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.post import Post, Favorite, PostLike, Comment
from ..schemas.user import UserResponse
from ..schemas.post import PostResponse
from ..api.deps import get_current_active_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_profile(
    username: str = None,
    email: str = None,
    bio: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if username:
        existing = db.query(User).filter(User.username == username, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
        current_user.username = username
    
    if email:
        existing = db.query(User).filter(User.email == email, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already taken")
        current_user.email = email
    
    if bio is not None:
        current_user.bio = bio
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.get("/me/favorites", response_model=List[PostResponse])
def get_my_favorites(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    favorites = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    result = []
    
    for fav in favorites:
        post = db.query(Post).filter(Post.id == fav.post_id).first()
        if post:
            author = db.query(User).filter(User.id == post.user_id).first()
            likes_count = db.query(PostLike).filter(PostLike.post_id == post.id).count()
            comments_count = db.query(Comment).filter(Comment.post_id == post.id).count()
            
            is_liked = db.query(PostLike).filter(
                PostLike.post_id == post.id,
                PostLike.user_id == current_user.id
            ).first() is not None
            
            result.append(PostResponse(
                **post.__dict__,
                author_username=author.username if author else "Unknown",
                likes_count=likes_count,
                comments_count=comments_count,
                is_liked=is_liked,
                is_favorited=True
            ))
    
    return result


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.get("/{user_id}/posts", response_model=List[PostResponse])
def get_user_posts(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    posts = db.query(Post).filter(Post.user_id == user_id, Post.status == "published").order_by(Post.created_at.desc()).all()
    result = []
    
    for post in posts:
        likes_count = db.query(PostLike).filter(PostLike.post_id == post.id).count()
        comments_count = db.query(Comment).filter(Comment.post_id == post.id).count()
        
        result.append(PostResponse(
            **post.__dict__,
            author_username=user.username,
            likes_count=likes_count,
            comments_count=comments_count,
            is_liked=False,
            is_favorited=False
        ))
    
    return result


@router.get("/", response_model=List[UserResponse])
def search_users(
    search: str = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(User)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (User.username.ilike(search_filter)) |
            (User.email.ilike(search_filter))
        )
    
    users = query.offset(skip).limit(limit).all()
    return users