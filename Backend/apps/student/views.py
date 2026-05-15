from rest_framework import views, permissions, status
from rest_framework.response import Response
from apps.projects.models import Project
from apps.projects.serializers import ProjectDetailSerializer


class StudentDashboardView(views.APIView):
    """
    Unified view for the student portal dashboard.
    Returns project details, milestones, documents, appointments, and evaluations in one call.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'student_profile'):
            return Response(
                {"error": "User does not have a student profile."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        project = Project.objects.filter(student=request.user.student_profile).first()
        if not project:
            return Response(
                {"message": "No project assigned yet.", "project": None}, 
                status=status.HTTP_200_OK
            )
            
        serializer = ProjectDetailSerializer(project)
        return Response(serializer.data)
