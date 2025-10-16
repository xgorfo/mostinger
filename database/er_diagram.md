erDiagram
    users {
        bigint id PK
        varchar email UK
        varchar username UK
        varchar password_hash
        varchar avatar_url
        text bio
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    categories {
        bigint id PK
        varchar name UK
        varchar slug UK
        text description
        timestamptz created_at
    }

    posts {
        bigint id PK
        bigint user_id FK
        varchar title
        varchar slug UK
        text content
        text excerpt
        varchar status
        varchar featured_image
        timestamptz created_at
        timestamptz updated_at
        timestamptz published_at
    }

    post_categories {
        bigint post_id PK,FK
        bigint category_id PK,FK
        timestamptz created_at
    }

    comments {
        bigint id PK
        bigint post_id FK
        bigint user_id FK
        bigint parent_comment_id FK
        text content
        boolean is_approved
        timestamptz created_at
        timestamptz updated_at
    }

    favorites {
        bigint user_id PK,FK
        bigint post_id PK,FK
        timestamptz created_at
    }

    subscriptions {
        bigint subscriber_id PK,FK
        bigint target_user_id PK,FK
        timestamptz created_at
    }

    post_likes {
        bigint user_id PK,FK
        bigint post_id PK,FK
        timestamptz created_at
    }

    users ||--o{ posts : "author"
    users ||--o{ comments : "author"
    users ||--o{ favorites : "user"
    users ||--o{ subscriptions : "subscriber"
    users ||--o{ subscriptions : "target"
    users ||--o{ post_likes : "user"
    posts ||--o{ comments : "post"
    posts ||--o{ favorites : "post"
    posts ||--o{ post_likes : "post"
    posts }o--|| post_categories : "post"
    categories }o--|| post_categories : "category"
    comments }o--|| comments : "parent"
