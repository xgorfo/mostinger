import sys
sys.path.insert(0, '.')

from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def create_admin():
    db = SessionLocal()
    
    # Check if admin exists
    existing = db.query(User).filter(User.username == "admin").first()
    if existing:
        print("Admin user already exists!")
        return
    
    admin = User(
        email="admin@mostinger.com",
        username="admin",
        password_hash=get_password_hash("admin123"),
        is_admin=True,
        is_active=True,
        bio="System Administrator"
    )
    
    db.add(admin)
    db.commit()
    db.refresh(admin)
    
    print(f"✅ Admin user created successfully!")
    print(f"   Email: {admin.email}")
    print(f"   Username: {admin.username}")
    print(f"   Password: admin123")
    print(f"   ID: {admin.id}")
    
    db.close()

if __name__ == "__main__":
    create_admin()
