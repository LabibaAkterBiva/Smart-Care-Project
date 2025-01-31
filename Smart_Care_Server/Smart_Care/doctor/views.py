from django.shortcuts import render
from rest_framework import viewsets, pagination, filters
from rest_framework.filters import SearchFilter
from .models import Doctor, Specialization, Designation, AvailableTime, Review
from .serializers import (
    DoctorSerializer,
    SpecializationSerializer,
    DesignationSerializer,
    AvailableTimeSerializer,
    ReviewSerializer,
)


# Pagination for Doctor API
class DoctorPagination(pagination.PageNumberPagination):
    page_size = 4  # Default page size
    page_size_query_param = 'page_size'  # Allow client to override page size
    max_page_size = 100

# ViewSet for Doctor model with search and pagination
class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    pagination_class = DoctorPagination
    filter_backends = [SearchFilter]  # Enable search functionality
    search_fields = [
        'user__username',  # Search by username of the doctor (related user model)
        'specialization__name',  # Search by specialization name
        'designation__name',  # Search by designation name
    ]


# BaseFilterBackend for filtering by doctor_id
class DoctorSpecificFilterMixin(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        doctor_id = request.query_params.get('doctor_id')
        if doctor_id is not None:
            return queryset.filter(doctor__id=doctor_id)  # Match doctor_id
        return queryset


# ViewSet for Specialization with doctor-specific filtering
class SpecializationViewSet(viewsets.ModelViewSet):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    filter_backends = [DoctorSpecificFilterMixin]  # Use the custom filter


# ViewSet for Designation with doctor-specific filtering
class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
    filter_backends = [DoctorSpecificFilterMixin]  # Use the custom filter


# ViewSet for AvailableTime with doctor-specific filtering
class AvailableTimeViewSet(viewsets.ModelViewSet):
    queryset = AvailableTime.objects.all()
    serializer_class = AvailableTimeSerializer
    filter_backends = [DoctorSpecificFilterMixin]  # Use the custom filter


# ViewSet for Review with doctor-specific filtering
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = [DoctorSpecificFilterMixin]  # Use the custom filter
