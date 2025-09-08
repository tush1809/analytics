1.Proper Image Tagging-->

-used consistent image naming with Docker hub registry such as tush1809/analytics:latest

--this helps to prevent the image comflict and ensure the deplyoment become reproducible

---also helps in rollback when using the vesioned tags

thus it reduces the deployment failure and enable better change management.
-----------------------------

2.Secure Registry Access

-implemented imagePullSecrets with regcred accross my all deployements that helps in security for production environment where security is paramount

--so it protects the unauthorized access to my private container images
-------------------------------
 3 .Image Pull Policy

 -set imagPullPolicy:Always for my data-upload service which ensures that latest security patches and bug fixes are always deployed

 --This reduces the debugging time related tot outdated image

 ------------------------------
 4.Comprehensive Resource Limits and Requests

 resources:
  requests:
    cpu: "50m"
    memory: "128Mi"
  limits:
    cpu: "200m" 
    memory: "512Mi"

-This ensured that each pod get minimum required resource

--ensures application performance by preventing cascading failure
-------------------------------
5.Implemented Horizontal Pod Autoscaling(HPA)

-Frontend HPA -->80% CPU threshold so that user facing component is able to handle the traffic spike efficiently

--Data Upload HPA-->50% CPU threshold,1-3 replicas in order to prevent queue buildup

---User Auth HPA-->50% CPU threshold,1-2 replicas since authentication is critical lower threshold will make sure that it is responsive
-------------------------------

HEALTH MONITORING

-Liveness Probes in order to detect and recover from application deadlocks

--Readiness Probes in order to prevent traffice routing to unready pods

---Timing strategies for frontend and Backend
------------------------------
6. Security Implementation

- Namespace Isolation-->Dedicated analytics namespace for all services that made Network and resource isolation
-------------------------------
7.Network Security Policies

-Frontend → Backend Services: Controlled ingress on specific ports 

--Port-Specific Rules: Different policies for different service ports
-------------------------------
8.Secret Management

 -Service-specific secrets (analytics-secret, user-auth-secret,data-upload-secret.)

 ------------------------------
9.Role-Based Access Control (RBAC)

 -In order to provide the granular Permissions so that the services only get required api access

 --also ensure that each service will have dedicated identity 
 ------------------------------
10. Path-Based Routing

    - path: /api/auth
    - path: /api/data 
    - path: /api/analytics

 -clear separation for different service endpoint

                                         ---------------
                                               EOF
                                         ---------------