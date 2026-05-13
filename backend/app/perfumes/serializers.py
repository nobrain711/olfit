from rest_framework import serializers
from .models import Brand, Perfume

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'country_code']

class PerfumeSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    data = serializers.SerializerMethodField()
    image_asset = serializers.SerializerMethodField()
    
    class Meta:
        model = Perfume
        fields = [
            'id', 'brand', 'brand_name', 'korean_name', 'english_name', 
            'product_type', 'family', 'release_year', 'data', 'image_asset', 'created_at'
        ]

    def get_data(self, obj):
        detail = getattr(obj, 'detail', None)
        return getattr(detail, 'data', {}) or {}

    def get_image_asset(self, obj):
        detail = getattr(obj, 'detail', None)
        if detail is None:
            return {}

        image = detail.images.first()
        if image is None:
            return {}

        return {
            'original_url': image.original_url,
            'backend_path': image.processed_path,
            'base64': image.base64_data,
        }
