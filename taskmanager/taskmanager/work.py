from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
secret_key_from_file_work = 'django-insecure-#8-eyuj#1pdym)=&9rtutjdvh8pw4(jn*-i^)1g8)$m=l9s^mz'
databases = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        # 'ENGINE': 'django.db.backends.postgresql_psycopg2',
        # 'NAME': 'web_django',
        # 'USER' : 'menace134',
        # 'PASSWORD' : 'kqXK1Kjlhc50KNB',
        # 'HOST' : '10.10.1.251',
        # 'PORT' : '5432',
    }
}