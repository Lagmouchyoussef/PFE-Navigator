from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.authentication.permissions import IsJury
from apps.common.models import Project, Document, DocumentRemark, Evaluation

from .serializers import (
    JuryProjectSerializer, JuryDocumentSerializer,
    DocumentRemarkSerializer, JuryEvaluationSerializer,
)


class JuryProjectViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsJury]
    serializer_class = JuryProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(
            jury_assignments__jury_member=self.request.user
        ).distinct()


class JuryDocumentViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsJury]
    serializer_class = JuryDocumentSerializer

    def get_queryset(self):
        return Document.objects.filter(
            project__jury_assignments__jury_member=self.request.user,
            target='jury',
        ).distinct()

    @action(detail=True, methods=['get', 'post'], url_path='remarks')
    def remarks(self, request, pk=None):
        document = self.get_object()
        if request.method == 'GET':
            return Response(DocumentRemarkSerializer(document.remarks.all(), many=True).data)
        serializer = DocumentRemarkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(document=document, author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class JuryEvaluationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsJury]
    serializer_class = JuryEvaluationSerializer
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_queryset(self):
        return Evaluation.objects.filter(
            project__jury_assignments__jury_member=self.request.user
        ).distinct()

    def partial_update(self, request, *args, **kwargs):
        evaluation = self.get_object()
        allowed = {'jury_score', 'jury_comment', 'jury_criteria'}
        data = {k: v for k, v in request.data.items() if k in allowed}
        serializer = self.get_serializer(evaluation, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
