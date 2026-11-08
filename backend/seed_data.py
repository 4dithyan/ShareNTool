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
    print("Seeding Kerala community demo users and tools for ShareNTool...")

    # 1. Create Demo Users across Kerala (Kochi, Trivandrum, Kozhikode)
    users_data = [
        {
            'username': 'rahul_kurian',
            'email': 'rahul.k@example.com',
            'first_name': 'Rahul',
            'last_name': 'Kurian',
            'city': 'Kochi',
            'phone': '+91 98470 12345',
            'bio': 'Home DIY enthusiast in Ernakulam. I maintain clean, top-grade Bosch and Makita tools for neighborhood rent.',
            'avatar': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        },
        {
            'username': 'anjali_menon',
            'email': 'anjali.m@example.com',
            'first_name': 'Anjali',
            'last_name': 'Menon',
            'city': 'Trivandrum',
            'phone': '+91 94471 22334',
            'bio': 'Gardener and weekend renovator in Kazhakkoottam. Happy to share lawn equipment and ladders safely.',
            'avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        },
        {
            'username': 'faisal_rahman',
            'email': 'faisal.r@example.com',
            'first_name': 'Faisal',
            'last_name': 'Rahman',
            'city': 'Kozhikode',
            'phone': '+91 98950 33441',
            'bio': 'Mechanical engineer with a well-stocked home garage and pressure cleaners in Calicut.',
            'avatar': 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
        }
    ]

    created_users = []
    for ud in users_data:
        user, _ = User.objects.get_or_create(username=ud['username'], defaults={
            'email': ud['email'],
            'first_name': ud['first_name'],
            'last_name': ud['last_name']
        })
        user.first_name = ud['first_name']
        user.last_name = ud['last_name']
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

    # Clean out older Delhi tools to make Kerala authentic
    Tool.objects.all().delete()

    # 2. Seed Tools in Kerala locations
    tools_data = [
        {
            'owner': u1,
            'title': 'Bosch GSB 600W Impact Hammer Drill Kit',
            'category': 'power-tools',
            'description': 'Powerful 600W dual-mode impact drill machine with complete 100-piece accessory kit (drill bits, masonry screws, wall plugs, hammer). Perfect for hanging art, wall shelves, and woodwork.',
            'price_per_day': Decimal('249.00'),
            'security_deposit': Decimal('500.00'),
            'city': 'Kochi',
            'locality': 'Kaloor, Ernakulam',
            'condition': 'brand_new',
            'image_url': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
            'brand': 'Bosch',
            'rules_and_safety': 'Wear safety goggles provided in the case. Do not drill into water pipes or live electrical conduits.'
        },
        {
            'owner': u1,
            'title': 'Karcher WD3 Multi-Purpose Wet & Dry Vacuum Cleaner',
            'category': 'cleaning',
            'description': '1000W robust plastic container 17-litre wet and dry vacuum cleaner. Incredible suction power for home renovation debris, car interior deep-cleaning, and monsoon puddle clearing.',
            'price_per_day': Decimal('349.00'),
            'security_deposit': Decimal('800.00'),
            'city': 'Kochi',
            'locality': 'Kadavanthra',
            'condition': 'good',
            'image_url': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
            'brand': 'Karcher',
            'rules_and_safety': 'Clean out filter bucket after suctioning wet waste. Do not use without the cartridge filter.'
        },
        {
            'owner': u2,
            'title': 'Plantex 6-Step Heavy-Duty Foldable Aluminum Ladder',
            'category': 'ladders-scaffolding',
            'description': 'Lightweight yet rugged anti-skid step ladder with top tool platform. Supports up to 150kg. Ideal for ceiling fan cleaning, roof repairs, curtain hanging, and painting.',
            'price_per_day': Decimal('199.00'),
            'security_deposit': Decimal('400.00'),
            'city': 'Trivandrum',
            'locality': 'Pattom',
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
            'city': 'Trivandrum',
            'locality': 'Kazhakkoottam',
            'condition': 'good',
            'image_url': 'https://images.unsplash.com/photo-1592417817098-8f3d69104a49?auto=format&fit=crop&w=800&q=80',
            'brand': 'Makita',
            'rules_and_safety': 'Keep hands and feet clear of rotating blades. Inspect garden for stones before mowing.'
        },
        {
            'owner': u3,
            'title': 'Wagner Control Pro High-Volume Paint Sprayer',
            'category': 'painting',
            'description': 'Airless paint sprayer gun with adjustable flow rate. Paint compound walls, gates, or entire interior rooms smoothly with drip-free finish. Easy to disassemble and wash.',
            'price_per_day': Decimal('399.00'),
            'security_deposit': Decimal('900.00'),
            'city': 'Kozhikode',
            'locality': 'Mananchira',
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
            'city': 'Kozhikode',
            'locality': 'Palayam',
            'condition': 'good',
            'image_url': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
            'brand': 'Stanley',
            'rules_and_safety': 'Please ensure all bits and sockets are returned to their designated slots in the case.'
        }
    ]

    for td in tools_data:
        Tool.objects.create(**td)

    # 3. Create Sample Booking and Payment for testing
    t1 = Tool.objects.first()
    if t1:
        booking = Booking.objects.create(
            tool=t1,
            renter=u2,
            start_date='2026-11-10',
            end_date='2026-11-12',
            total_days=2,
            rent_amount=Decimal('498.00'),
            security_deposit=Decimal('500.00'),
            total_amount=Decimal('998.00'),
            status='approved',
            handover_otp='3941',
            return_otp='7822',
            notes='Will pick up in the morning around 10 AM in Kochi.'
        )

        Payment.objects.create(
            booking=booking,
            amount=Decimal('998.00'),
            payment_method='upi',
            transaction_id='PAY-SNT-KERALA-DEMO-01',
            status='paid'
        )

        Review.objects.create(
            tool=t1,
            user=u2,
            rating=5,
            comment='Rahul was extremely helpful! The Bosch hammer drill was in mint condition and helped me finish our home wall fixtures in Kochi in no time.'
        )

        Notification.objects.create(
            user=u1,
            title='New Tool Rental Request',
            message='Anjali from Trivandrum requested to rent your Bosch Hammer Drill for 2 days.'
        )

    print("Kerala tool sharing database seeded successfully with Kochi, Trivandrum, and Kozhikode listings!")

if __name__ == '__main__':
    seed()
