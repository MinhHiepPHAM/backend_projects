from django.db import models
from django.core.cache import cache

class CacheModel:
    @classmethod
    def _cache_key(cls, key):
        return f'{cls.__class__.__name__}_{key}'
    
    @classmethod
    def get(cls, key):
        cache_key = cls._cache_key(key)
        print(key, cache_key)
        obj = cache.get(cache_key)
        if obj: return obj
        try:
            obj = cls.objects.get(pk=key)
        except cls.DoesNotExist:
            return None
        cache.add(cache_key,obj)

    @classmethod
    def flush(cls, key):
        cache_key = cls._cache_key(key)
        cache.delete(cache_key)

    def save(self, *args, **kwargs):
        self.flush(self.pk)
        return super().save(*args,**kwargs)
    
    def save(self, *args, **kwargs):
        self.flush(self.pk)
        return super().save(*args, **kwargs)
    
    def delete(self, *args, **kwagrs):
        self.flush(self.pk)
        return super().delete(*args, **kwagrs)