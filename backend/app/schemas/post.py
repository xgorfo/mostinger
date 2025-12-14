from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=10)
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=10)
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None


class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1)
    parent_comment_id: Optional[int] = None


class CommentResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    author_username: str
    content: str
    parent_comment_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class PostResponse(PostBase):
    id: int
    user_id: int
    author_username: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime]
    likes_count: int = 0
    comments_count: int = 0
    is_liked: bool = False
    is_favorited: bool = False

    class Config:
        from_attributes = True


class PostList(BaseModel):
    items: List[PostResponse]
    total: int
    page: int
    page_size: int
    pages: int