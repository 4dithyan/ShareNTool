import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sharetool.settings')
django.setup()

from django.contrib.auth.models import User
from accounts.models import UserProfile
from tools.models import Tool
from bookings.models import Booking
from payments.models import Payment
from reviews.models import Review
from notifications.models import Notification

def seed():
    print("Seeding demo users and tools for ShareNTool...")

    # 1. Create Demo Users
    users_data = [
        {
            'username': 'rahul_sharma',
            'email': 'rahul@example.com',
            'first_name': 'Rahul',
            'last_name': 'Sharma',
            'city': 'South Delhi',
            'phone': '+91 98765 43210',
            'bio': 'Home DIY enthusiast. I maintain clean, top-grade Bosch and Makita tools for neighborhood rent.',
            'avatar': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        },
        {
            'username': 'priya_patel',
            'email': 'priya@example.com',
            'first_name': 'Priya',
            'last_name': 'Patel',
            'city': 'Gurugram',
            'phone': '+91 98111 22334',
            'bio': 'Gardener and weekend renovator. Happy to share lawn equipment and ladders safely.',
            'avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        },
        {
            'username': 'amit_verma',
            'email': 'amit@example.com',
            'first_name': 'Amit',
            'last_name': 'Verma',
            'city': 'Noida',
            'phone': '+91 99223 88441',
            'bio': 'Mechanical engineer with a well-stocked home garage and pressure cleaners.',
            'avatar': 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
        }
    ]

    created_users = []
    for ud in users_data:
        user, created = User.objects.get_or_create(username=ud['username'], defaults={
            'email': ud['email'],
            'first_name': ud['first_name'],
            'last_name': ud['last_name']
        })
        user.set_password('password123')
        user.save()
        UserProfile.objects.update_or_create(user=user, defaults={
            'phone': ud['phone'],
            'city': ud['city'],
            'bio': ud['bio'],
            'avatar_url': ud['avatar'],
            'is_verified': True
        })
        created_users.append(user)

    u1, u2, u3 = created_users[0], created_users[1], created_users[2]

    # 2. Seed Tools
    tools_data = [
        {
            'owner': u1,
            'title': 'Bosch GSB 600W Impact Hammer Drill Kit',
            'category': 'power-tools',
            'description': 'Powerful 600W dual-mode impact drill machine with complete 100-piece accessory kit (drill bits, screws, anchors, hammer). Perfect for hanging art, wall fixtures, and woodworking.',
            'price_per_day': Decimal('249.00'),
            'security_deposit': Decimal('500.00'),
            'city': 'South Delhi',
            'locality': 'Greater Kailash 1',
            'condition': 'brand_new',
            'image_url': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
            'brand': 'Bosch',
            'rules_and_safety': 'Wear safety goggles provided in the case. Do not drill into water pipes or live electrical lines.'
        },
        {
            'owner': u1,
            'title': 'Karcher WD3 Multi-Purpose Wet & Dry Vacuum Cleaner',
            'category': 'cleaning',
            'description': '1000W robust plastic container 17-litre wet and dry vacuum cleaner. Incredible suction power for home renovation debris, car interior deep-cleaning, and water spills.',
            'price_per_day': Decimal('349.00'),
            'security_deposit': Decimal('800.00'),
            'city': 'South Delhi',
            'locality': 'Hauz Khas',
            'condition': 'good',
            'image_url': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
            'brand': 'Karcher',
            'rules_and_safety': 'Clean out filter bucket after suctioning wet waste. Do not use without the cartridge filter.'
        },
        {
            'owner': u2,
            'title': 'Plantex 6-Step Heavy-Duty Foldable Aluminum Ladder',
            'category': 'ladders-scaffolding',
            'description': 'Lightweight yet rugged anti-skid step ladder with top tool platform. Supports up to 150kg. Ideal for ceiling fan cleaning, chandelier repair, curtain hanging, and painting.',
            'price_per_day': Decimal('199.00'),
            'security_deposit': Decimal('400.00'),
            'city': 'Gurugram',
            'locality': 'DLF Phase 4',
            'condition': 'brand_new',
            'image_url': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
            'brand': 'Plantex',
            'rules_and_safety': 'Place on flat ground only. Lock safety hinge before stepping up.'
        },
        {
            'owner': u2,
            'title': 'Makita Cordless Electric Lawn Mower & Grass Trimmer',
            'category': 'gardening',
            'description': 'Battery-operated quiet cordless lawn mower with adjustable cutting height and 30L grass collection box. Comes with two rechargeable Li-ion batteries and dual charger.',
            'price_per_day': Decimal('499.00'),
            'security_deposit': Decimal('1200.00'),
            'city': 'Gurugram',
            'locality': 'Sector 56',
            'condition': 'good',
            'image_url': 'https://images.unsplash.com/photo-1592417817098-8f3d69104a49?auto=format&fit=crop&w=800&q=80',
            'brand': 'Makita',
            'rules_and_safety': 'Keep hands and feet clear of rotating blades. Inspect lawn for stones before mowing.'
        },
        {
            'owner': u3,
            'title': 'Wagner Control Pro High-Volume Paint Sprayer',
            'category': 'painting',
            'description': 'Airless paint sprayer gun with adjustable flow rate. Paint an entire room or garden fence in minutes with smooth, drip-free coverage. Easy to disassemble and wash.',
            'price_per_day': Decimal('399.00'),
            'security_deposit': Decimal('900.00'),
            'city': 'Noida',
            'locality': 'Sector 62',
            'condition': 'brand_new',
            'image_url': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
            'brand': 'Wagner',
            'rules_and_safety': 'Thoroughly flush water/thinner through nozzle immediately after painting to prevent clogging.'
        },
        {
            'owner': u3,
            'title': 'Stanley 142-Piece Mechanics & Home Hand Tool Set',
            'category': 'hand-tools',
            'description': 'Chrome-vanadium socket wrenches, ratchets, pliers, screwdrivers, hex keys, and measuring tape organized in a rugged blowout carrying case.',
            'price_per_day': Decimal('179.00'),
            'security_deposit': Decimal('300.00'),
            'city': 'Noida',
            'locality': 'Sector 18',
            'condition': 'good',
            'image_url': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
            'brand': 'Stanley',
            'rules_and_safety': 'Please ensure all bits and sockets are returned to their designated slots in the case.'
        }
    ]

    for td in tools_data:
        tool, _ = Tool.objects.update_or_create(title=td['title'], defaults=td)

    # 3. Create Sample Booking and Payment for testing
    t1 = Tool.objects.first()
    if t1:
        booking, _ = Booking.objects.get_or_create(
            tool=t1,
            renter=u2,
            defaults={
                'start_date': '2026-11-10',
                'end_date': '2026-11-12',
                'total_days': 2,
                'rent_amount': Decimal('498.00'),
                'security_deposit': Decimal('500.00'),
                'total_amount': Decimal('998.00'),
                'status': 'approved',
                'handover_otp': '3941',
                'return_otp': '7822',
                'notes': 'Will pick up in the morning around 10 AM.'
            }
        )

        Payment.objects.get_or_create(
            booking=booking,
            defaults={
                'amount': Decimal('998.00'),
                'payment_method': 'upi',
                'transaction_id': 'PAY-SNT-COLLEGE-DEMO-01',
                'status': 'paid'
            }
        )

        Review.objects.get_or_create(
            tool=t1,
            user=u2,
            defaults={
                'rating': 5,
                'comment': 'Rahul was extremely polite! The Bosch hammer drill was brand new and helped me put up all my heavy shelving without a hitch.'
            }
        )

        Notification.objects.get_or_create(
            user=u1,
            title='New Tool Rental Request',
            defaults={
                'message': 'Priya requested to rent your Bosch Hammer Drill for 2 days.'
            }
        )

    print("Database successfully seeded with realistic tools, accounts, reviews, and bookings!")

if __name__ == '__main__':
    seed()

