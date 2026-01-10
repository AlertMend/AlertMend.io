---
title: "Kubernetes And Ai"
excerpt: "================================================================================ REFERENCE CONTENT FROM TOP 8 GOOGLE SEARCH RESULTS"
date: "2025-12-18"
category: "Kubernetes"
author: "AlertMend Team"
keywords: "AlertMend AI, AIOps, DevOps, Kubernetes, Ai, Guide, Running, Ml"
---

# Kubernetes And Ai: A Guide To Running Ml Workloads Efficiently

*Generated on 2025-12-25 16:12:41*

---

================================================================================
REFERENCE CONTENT FROM TOP 8 GOOGLE SEARCH RESULTS
This content is gathered from the top-ranking pages for comprehensive reference. https://collabnix.com/kubernetes-and-ai-the-ultimate-guide-to-orchestrating-machine-learning-workloads-in-2025/

2. https://portworx.com/knowledge-hub/kubernetes-ai/
3. https://pages.run.ai/hubfs/PDFs/Scaling-Up-AI-ML-with-Kubernetes.pdf

 4.
https://www.techtarget.com/searchEnterpriseAI/tip/How-and-why-to-run-machine-learning-workloads-on-Kubernetes

5. https://kubetools.io/scaling-up-ai-ml-with-kubernetes-a-comprehensive-guide/
6. https://www.wiz.io/academy/ai-ml-kubernetes-best-practices
7. https://www.f5.com/company/blog/nginx/a-quick-guide-to-scaling-ai-ml-workloads-on-kubernetes
8. https://www.redhat.com/en/topics/cloud-computing/how-kubernetes-can-assist-ai

The following sections contain content from each source, organized for reference.
utilize this information to comprehend the topic comprehensively, identify key points,
related keywords, and best practices. Then create original, SEO-optimized content
that synthesizes insights from all sources while using completely original wording. SOURCE 1: https://collabnix.com/kubernetes-and-ai-the-ultimate-guide-to-orchestrating-machine-learning-workloads-in-2025/
Table of Contents Toggle The intersection of Kubernetes and AI represents one of the most transformative developments in modern technology infrastructure.
As artificial intelligence and machine learning workloads become increasingly complex and resource-intensive, organizations worldwide are turning to Kubernetes to orchestrate, scale, and manage their AI applications efficiently. In this comprehensive guide, we’ll explore how Kubernetes has become the backbone of AI infrastructure, enabling organizations to deploy machine learning models at scale while maintaining reliability, cost-effectiveness, and operational efficiency.
Kubernetes , often abbreviated as K8s, is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. Originally developed by Google, Kubernetes has evolved into the de facto standard for container orchestration across enterprises. The AI Infrastructure Challenge Traditional AI and machine learning deployments face several critical challenges: Resource Management Complexity : AI workloads require dynamic resource allocation, often needing GPUs, CPUs, and memory in varying combinations depending on the training or inference phase.
Scalability Demands : Machine learning models require to scale horizontally during training and vertically during inference, requiring sophisticated orchestration capabilities. Environment Consistency : AI applications must run consistently across development, testing, and production environments, which traditional deployment methods struggle to guarantee. Cost Optimization : GPU resources are expensive, and organizations require efficient ways to maximize utilization while minimizing costs.
How Kubernetes Transforms AI and Machine Learning Operations 1. Dynamic Resource Allocation for AI Workloads Kubernetes excels at managing the diverse resource requirements of AI applications. Through its resource quotas and limits , Kubernetes can: Automatically allocate GPU resources to machine learning training jobs Scale CPU and memory based on inference demand Implement resource sharing across multiple AI teams and projects Provide quality of service guarantees for critical AI workloads 2.
Automated Scaling for Machine Learning Models One of Kubernetes’ greatest strengths in the AI domain is its ability to automatically scale applications based on demand.
The Horizontal Pod Autoscaler (HPA) and Vertical Pod Autoscaler (VPA) enable: Automatic scaling of inference servers based on request volume Dynamic resource adjustment for training jobs Cost optimization through intelligent resource allocation Load balancing across multiple model instances 3.
MLOps Integration and Continuous Deployment Kubernetes seamlessly integrates with MLOps pipelines, enabling: Automated model deployment and versioning A/B testing of different model versions Rollback capabilities for model updates Integration with CI/CD pipelines for machine learning workflows Essential Kubernetes Tools and Platforms for AI Kubeflow: The Complete ML Platform Kubeflow stands as the most comprehensive platform for running machine learning workloads on Kubernetes.
Key components include: Kubeflow Pipelines : For building and deploying portable ML workflows Katib : For automated hyperparameter tuning and neural architecture search KFServing : For model serving and inference Training Operators : For distributed training of TensorFlow, PyTorch, and other frameworks KubeAI and AI-Specific Operators Several specialized operators extend Kubernetes capabilities for AI: TensorFlow Operator : Manages TensorFlow training jobs PyTorch Operator : Handles PyTorch distributed training MPI Operator : Supports MPI-based distributed training Volcano : Provides advanced batch scheduling for AI workloads GPU Management and Scheduling Effective GPU management is crucial for AI workloads on Kubernetes: NVIDIA GPU Operator : Simplifies GPU management and monitoring GPU sharing and time-slicing : Maximizes GPU utilization Multi-Instance GPU (MIG) : Provides GPU virtualization for better resource utilization Best Practices for Running AI on Kubernetes 1.
Container Optimization for AI Workloads Creating efficient containers for AI applications requires specific considerations: Base Image Selection : utilize optimized base images with pre-installed AI frameworks like TensorFlow, PyTorch, or CUDA. Dependency Management : Implement proper dependency management to avoid conflicts between different AI libraries. Security Scanning : Regularly scan AI containers for vulnerabilities, especially crucial given the sensitive nature of AI data.
Resource Management Strategies Effective resource management ensures optimal performance and cost efficiency: Resource Requests and Limits : Set appropriate CPU, memory, and GPU requests and limits for AI workloads. Node Affinity and Taints : utilize node affinity to schedule AI workloads on appropriate hardware (GPU nodes, high-memory nodes). Priority Classes : Implement priority classes to ensure critical AI workloads obtain resources when needed.
Data Management and Storage AI workloads require sophisticated data management strategies: Persistent Volumes : utilize appropriate storage classes for different types of AI data (training data, model artifacts, logs). Data Pipeline Integration : Integrate with data pipeline tools to ensure smooth data flow to AI workloads. Backup and Recovery : Implement robust backup strategies for valuable AI models and training data. Common utilize Cases: Kubernetes and AI in Action 1.
Large-Scale Machine Learning Training Organizations utilize Kubernetes to orchestrate distributed training across multiple nodes: Distributed TensorFlow training across multiple GPUs and nodes PyTorch distributed data parallel training for large models Hyperparameter optimization running hundreds of parallel experiments Model ensemble training with different algorithms and parameters 2. AI Model Serving and Inference Kubernetes provides robust model serving capabilities: Real-time inference with automatic scaling based on request volume Batch inference for processing large datasets Multi-model serving with efficient resource sharing A/B testing of different model versions in production 3.
AI Development Environments Kubernetes enables consistent development environments: Jupyter notebook servers with GPU access for data scientists Development sandboxes with isolated environments for different teams Collaborative environments with shared storage and resources CI/CD integration for automated testing and deployment of AI models Overcoming Challenges in Kubernetes AI Deployments 1. GPU Resource Management Managing GPU resources effectively requires careful planning: Challenge : GPUs are expensive and often underutilized in traditional deployments.
Solution : Implement GPU sharing, utilize fractional GPUs where appropriate, and employ intelligent scheduling to maximize utilization. Data Pipeline Integration Integrating data pipelines with Kubernetes may be complex: Challenge : AI workloads require access to large datasets that may be stored in various locations. Solution : utilize tools like Apache Airflow on Kubernetes, implement proper data locality strategies, and leverage high-performance storage solutions.
Model Versioning and Deployment Managing multiple model versions and deployments: Challenge : Tracking different model versions and ensuring smooth deployments. Solution : Implement MLOps practices with tools like MLflow, utilize GitOps for model deployment, and maintain proper model registries. Security Considerations for AI on Kubernetes 1. Data Protection and Privacy AI workloads often process sensitive data requiring robust security measures: Encryption at rest and in transit for all AI data Network policies to isolate AI workloads RBAC (Role-Based Access Control) for controlling access to AI resources Pod security policies to ensure secure container execution 2.
Model Security Protecting AI models from theft or tampering: Model encryption for valuable intellectual property Access logging for model serving endpoints Vulnerability scanning for AI container images Supply chain security for AI dependencies and frameworks Performance Optimization Strategies 1. Hardware Optimization Maximizing hardware utilization for AI workloads: GPU Utilization : Implement GPU monitoring and optimize batch sizes for maximum throughput.
Memory Management : utilize memory-mapped files for large datasets and implement efficient caching strategies. Network Optimization : Optimize network configuration for distributed training and data movement. Application-Level Optimization Optimizing AI applications for Kubernetes environments: Batching Strategies : Implement dynamic batching for inference workloads to improve throughput. Caching Mechanisms : utilize Redis or other caching solutions to cache frequently accessed data or model outputs.
Connection Pooling : Implement connection pooling for database and external service connections. Monitoring and Observability for AI Workloads 1. Infrastructure Monitoring Comprehensive monitoring of Kubernetes infrastructure supporting AI: Prometheus and Grafana for metrics collection and visualization GPU monitoring with NVIDIA DCGM and custom metrics Resource utilization tracking for cost optimization Node health monitoring for early problem detection 2.
Application Monitoring Monitoring AI-specific metrics and performance: Model performance metrics (accuracy, latency, throughput) Data drift detection for model degradation Training job monitoring for distributed training workloads Inference latency tracking for serving applications Cost Optimization for AI on Kubernetes 1. Resource Right-Sizing Optimizing resource allocation to minimize costs: Spot Instances : utilize spot instances for training workloads that can tolerate interruptions.
Mixed Instance Types : Combine different instance types based on workload requirements. Automatic Scaling : Implement horizontal and vertical pod autoscaling to optimize resource usage. GPU Cost Management Strategies for managing expensive GPU resources: GPU Sharing : Implement GPU sharing for development and light inference workloads. Preemptible Training : utilize preemptible instances for long-running training jobs. Scheduling Optimization : Implement intelligent scheduling to maximize GPU utilization.
Future Trends: The Evolution of Kubernetes and AI 1. Edge AI and Kubernetes The expansion of AI to edge environments presents new opportunities: Lightweight Kubernetes distributions for edge deployments Federated learning coordination through Kubernetes Edge-to-cloud AI pipelines with seamless integration Real-time inference at the edge with Kubernetes orchestration 2. Serverless AI on Kubernetes The convergence of serverless computing and AI: Knative for AI workloads enabling serverless model serving Event-driven AI pipelines triggered by data availability Auto-scaling to zero for cost-effective AI deployments Function-as-a-Service (FaaS) for AI microservices 3.
AI-Powered Kubernetes Operations AI enhancing Kubernetes operations themselves: Predictive scaling based on historical patterns Intelligent resource allocation using machine learning Automated anomaly detection for Kubernetes clusters Self-healing systems powered by AI algorithms Practical Code Examples for Kubernetes AI Deployments 1.
Dockerfile for AI Model Serving Here’s a production-ready Dockerfile for serving a TensorFlow model: # utilize official TensorFlow serving image with GPU support FROM tensorflow/serving:2. 0-gpu # Set environment variables ENV MODEL_NAME=my_ai_model ENV MODEL_BASE_PATH=/models # Create model directory RUN mkdir -p ${MODEL_BASE_PATH} # Copy your trained model COPY. /saved_model ${MODEL_BASE_PATH}/${MODEL_NAME}/1/ # Expose the serving port EXPOSE 8500 8501 # Configure TensorFlow Serving CMD ["tensorflow_model_server", \ "--port=8500", \ "--rest_api_port=8501", \ "--model_name=${MODEL_NAME}", \ "--model_base_path=${MODEL_BASE_PATH}/${MODEL_NAME}"] 2.
Kubernetes Deployment for AI Model Serving Deploy your AI model with GPU support and autoscaling: apiVersion: apps/v1 kind: Deployment metadata: name: ai-model-serving labels: app: ai-model-serving spec: replicas: 2 selector: matchLabels: app: ai-model-serving template: metadata: labels: app: ai-model-serving spec: containers: - name: tensorflow-serving image: your-registry/ai-model:latest ports: - containerPort: 8500 name: grpc - containerPort: 8501 name: rest resources: requests: memory: "2Gi" cpu: "1000m" nvidia.
com/gpu: 1 limits: memory: "4Gi" cpu: "2000m" nvidia. com/gpu: 1 env: - name: MODEL_NAME value: "my_ai_model" livenessProbe: httpGet: path: /v1/models/my_ai_model port: 8501 initialDelaySeconds: 30 periodSeconds: 10 readinessProbe: httpGet: path: /v1/models/my_ai_model port: 8501 initialDelaySeconds: 15 periodSeconds: 5 nodeSelector: accelerator: nvidia-tesla-v100 tolerations: - key: nvidia. com/gpu operator: Exists effect: NoSchedule --- apiVersion: v1 kind: Service metadata: name: ai-model-service spec: selector: app: ai-model-serving ports: - name: grpc port: 8500 targetPort: 8500 - name: rest port: 8501 targetPort: 8501 type: ClusterIP 3.
Horizontal Pod Autoscaler for AI Workloads Automatically scale your AI model based on CPU and custom metrics: apiVersion: autoscaling/v2 kind: HorizontalPodAutoscaler metadata: name: ai-model-hpa spec: scaleTargetRef: apiVersion: apps/v1 kind: Deployment name: ai-model-serving minReplicas: 2 maxReplicas: 10 metrics: - type: Resource resource: name: cpu target: type: Utilization averageUtilization: 70 - type: Resource resource: name: memory target: type: Utilization averageUtilization: 80 - type: Pods pods: metric: name: requests_per_second target: type: AverageValue averageValue: "100" behavior: scaleDown: stabilizationWindowSeconds: 300 policies: - type: Percent value: 10 periodSeconds: 60 scaleUp: stabilizationWindowSeconds: 0 policies: - type: Percent value: 100 periodSeconds: 15 - type: Pods value: 2 periodSeconds: 60 4.
TensorFlow Training Job with Kubeflow Deploy a distributed TensorFlow training job using Kubeflow’s TFJob operator: apiVersion: kubeflow. org/v1 kind: TFJob metadata: name: distributed-training spec: tfReplicaSpecs: Chief: replicas: 1 restartPolicy: OnFailure template: spec: containers: - name: tensorflow image: tensorflow/tensorflow:2. 0-gpu command: - python - /opt/training/train. py - --model_dir=/tmp/model - --batch_size=32 - --learning_rate=0. 001 resources: requests: memory: "4Gi" cpu: "2" nvidia.
com/gpu: 1 limits: memory: "8Gi" cpu: "4" nvidia. com/gpu: 1 volumeMounts: - name: training-data mountPath: /data - name: model-storage mountPath: /tmp/model volumes: - name: training-data persistentVolumeClaim: claimName: training-data-pvc - name: model-storage persistentVolumeClaim: claimName: model-storage-pvc Worker: replicas: 3 restartPolicy: OnFailure template: spec: containers: - name: tensorflow image: tensorflow/tensorflow:2. 0-gpu command: - python - /opt/training/train.
py - --model_dir=/tmp/model - --batch_size=32 - --learning_rate=0. 001 resources: requests: memory: "4Gi" cpu: "2" nvidia. com/gpu: 1 limits: memory: "8Gi" cpu: "4" nvidia. com/gpu: 1 volumeMounts: - name: training-data mountPath: /data - name: model-storage mountPath: /tmp/model volumes: - name: training-data persistentVolumeClaim: claimName: training-data-pvc - name: model-storage persistentVolumeClaim: claimName: model-storage-pvc 5. PyTorch Distributed Training with PyTorchJob Run distributed PyTorch training across multiple nodes: apiVersion: kubeflow.
org/v1 kind: PyTorchJob metadata: name: pytorch-distributed-training spec: pytorchReplicaSpecs: Master: replicas: 1 restartPolicy: OnFailure template: spec: containers: - name: pytorch image: pytorch/pytorch:2. 7-cudnn8-runtime command: - python - /workspace/train. py - --backend=nccl - --epochs=100 - --batch-size=64 resources: requests: nvidia. com/gpu: 1 memory: "8Gi" cpu: "4" limits: nvidia. com/gpu: 1 memory: "16Gi" cpu: "8" env: - name: LOGLEVEL value: INFO volumeMounts: - name: dataset mountPath: /data - name: workspace mountPath: /workspace volumes: - name: dataset persistentVolumeClaim: claimName: dataset-pvc - name: workspace configMap: name: training-scripts Worker: replicas: 2 restartPolicy: OnFailure template: spec: containers: - name: pytorch image: pytorch/pytorch:2.
7-cudnn8-runtime command: - python - /workspace/train. py - --backend=nccl - --epochs=100 - --batch-size=64 resources: requests: nvidia. com/gpu: 1 memory: "8Gi" cpu: "4" limits: nvidia. com/gpu: 1 memory: "16Gi" cpu: "8" volumeMounts: - name: dataset mountPath: /data - name: workspace mountPath: /workspace volumes: - name: dataset persistentVolumeClaim: claimName: dataset-pvc - name: workspace configMap: name: training-scripts 6. Jupyter Notebook Environment for Data Scientists Create a GPU-enabled Jupyter environment for your data science team: apiVersion: apps/v1 kind: Deployment metadata: name: jupyter-gpu spec: replicas: 1 selector: matchLabels: app: jupyter-gpu template: metadata: labels: app: jupyter-gpu spec: securityContext: runAsUser: 1000 runAsGroup: 100 fsGroup: 100 containers: - name: jupyter image: jupyter/tensorflow-notebook:python-3.
10 ports: - containerPort: 8888 resources: requests: nvidia. com/gpu: 1 memory: "4Gi" cpu: "2" limits: nvidia. com/gpu: 1 memory: "8Gi" cpu: "4" env: - name: JUPYTER_ENABLE_LAB value: "yes" - name: GRANT_SUDO value: "yes" volumeMounts: - name: jupyter-data mountPath: /home/jovyan/work - name: shared-datasets mountPath: /home/jovyan/datasets readOnly: true volumes: - name: jupyter-data persistentVolumeClaim: claimName: jupyter-data-pvc - name: shared-datasets persistentVolumeClaim: claimName: shared-datasets-pvc nodeSelector: accelerator: nvidia-tesla-v100 --- apiVersion: v1 kind: Service metadata: name: jupyter-service spec: selector: app: jupyter-gpu ports: - port: 8888 targetPort: 8888 type: LoadBalancer 7.
ConfigMap for Model Configuration Manage model configurations and hyperparameters: apiVersion: v1 kind: ConfigMap metadata: name: ai-model-config data: model_config. json: | { "model_name": "image_classifier", "model_version": "1. 0", "batch_size": 32, "max_sequence_length": 512, "confidence_threshold": 0. 8, "preprocessing": { "normalize": true, "resize_to": [224, 224], "mean": [0. 225] }, "postprocessing": { "top_k": 5, "output_format": "json" } } training_config.
yaml: | training: epochs: 100 learning_rate: 0. 001 optimizer: "adam" loss_function: "categorical_crossentropy" metrics: ["accuracy", "top_5_accuracy"] early_stopping: patience: 10 monitor: "val_loss" model_checkpoint: save_best_only: true monitor: "val_accuracy" mode: "max" 8. Persistent Volume Claims for AI Data Set up storage for datasets and model artifacts: apiVersion: v1 kind: PersistentVolumeClaim metadata: name: training-data-pvc spec: accessModes: - ReadWriteMany resources: requests: storage: 100Gi storageClassName: fast-ssd --- apiVersion: v1 kind: PersistentVolumeClaim metadata: name: model-storage-pvc spec: accessModes: - ReadWriteMany resources: requests: storage: 50Gi storageClassName: fast-ssd --- apiVersion: v1 kind: PersistentVolumeClaim metadata: name: shared-datasets-pvc spec: accessModes: - ReadOnlyMany resources: requests: storage: 500Gi storageClassName: standard 9.
Python Flask API for Model Serving Simple REST API wrapper for your ML model: from flask import Flask, request, jsonify import tensorflow as tf import numpy as np import logging import os from prometheus_client import Counter, Histogram, generate_latest import time app = Flask(__name__) # Prometheus metrics REQUEST_COUNT = Counter('model_requests_total', 'Total model requests') REQUEST_LATENCY = Histogram('model_request_duration_seconds', 'Model request latency') PREDICTION_COUNT = Counter('model_predictions_total', 'Total predictions made', ['model_version']) # Load model MODEL_PATH = os.
getenv('MODEL_PATH', '/models/my_model') model = tf. load_model(MODEL_PATH) MODEL_VERSION = os. getenv('MODEL_VERSION', '1. basicConfig(level=logging. INFO) logger = logging. getLogger(__name__) @app. route('/health', methods=['obtain']) def health_check(): """Health check endpoint for Kubernetes probes""" return jsonify({'status': 'healthy', 'model_version': MODEL_VERSION}), 200 @app. route('/ready', methods=['obtain']) def readiness_check(): """Readiness check endpoint""" attempt: # Test model prediction with dummy data dummy_input = np.
random((1, 224, 224, 3)) _ = model. predict(dummy_input) return jsonify({'status': 'ready', 'model_version': MODEL_VERSION}), 200 except Exception as e: logger. error(f"Model not ready: {str(e)}") return jsonify({'status': 'not ready', 'error': str(e)}), 503 @app. route('/predict', methods=['POST']) def predict(): """Main prediction endpoint""" start_time = time. inc() attempt: # obtain input data data = request. get_json() if 'instances' not in data: return jsonify({'error': 'Missing instances in request'}), 400 # Preprocess input instances = np.
array(data['instances']) if len(instances. shape) != 4: # Expecting (batch, height, width, channels) return jsonify({'error': 'Invalid input shape'}), 400 # create prediction predictions = model. predict(instances) PREDICTION_COUNT. labels(model_version=MODEL_VERSION). inc(len(instances)) # Format response response = { 'predictions': predictions. tolist(), 'model_version': MODEL_VERSION, 'request_id': request. obtain('X-Request-ID', 'unknown') } duration = time.
time() - start_time REQUEST_LATENCY. observe(duration) logger. info(f"Prediction completed in {duration:. 3f}s for {len(instances)} instances") return jsonify(response), 200 except Exception as e: logger. error(f"Prediction error: {str(e)}") return jsonify({'error': str(e)}), 500 @app. route('/metrics', methods=['obtain']) def metrics(): """Prometheus metrics endpoint""" return generate_latest() @app. route('/batch_predict', methods=['POST']) def batch_predict(): """Batch prediction endpoint for large datasets""" start_time = time.
inc() attempt: data = request. get_json() instances = np. array(data['instances']) batch_size = data. obtain('batch_size', 32) # Process in batches all_predictions = [] for i in range(0, len(instances), batch_size): batch = instances[i:i+batch_size] batch_predictions = model. predict(batch) all_predictions. extend(batch_predictions. tolist()) PREDICTION_COUNT. labels(model_version=MODEL_VERSION). inc(len(instances)) response = { 'predictions': all_predictions, 'model_version': MODEL_VERSION, 'processed_count': len(instances) } duration = time.
time() - start_time REQUEST_LATENCY. observe(duration) return jsonify(response), 200 except Exception as e: logger. error(f"Batch prediction error: {str(e)}") return jsonify({'error': str(e)}), 500 if __name__ == '__main__': app. 0', port=5000, debug=False) 10. Monitoring and Alerting Configuration Prometheus monitoring setup for AI workloads: apiVersion: v1 kind: ServiceMonitor metadata: name: ai-model-metrics spec: selector: matchLabels: app: ai-model-serving endpoints: - port: metrics interval: 30s path: /metrics --- apiVersion: monitoring.
com/v1 kind: PrometheusRule metadata: name: ai-model-alerts spec: groups: - name: ai-model-alerts rules: - alert: HighModelLatency expr: histogram_quantile(0. 95, rate(model_request_duration_seconds_bucket[5m])) > 1. 0 for: 2m labels: severity: warning annotations: summary: "High model inference latency" description: "95th percentile latency is {{ $value }}s" - alert: ModelErrorRate expr: rate(flask_http_request_exceptions_total[5m]) > 0. 1 for: 1m labels: severity: critical annotations: summary: "High model error rate" description: "Error rate is {{ $value }} errors/second" - alert: GPUMemoryHigh expr: nvidia_ml_py_device_memory_used_bytes / nvidia_ml_py_device_memory_total_bytes > 0.
9 for: 5m labels: severity: warning annotations: summary: "High GPU memory usage" description: "GPU memory usage is {{ $value | humanizePercentage }}" Getting Started: Your First AI Project on Kubernetes 1. Prerequisites and Setup Before deploying AI workloads on Kubernetes, ensure you have: Kubernetes Cluster : Set up a Kubernetes cluster with GPU support (EKS, GKE, or on-premises) Container Registry : Configure a container registry for storing AI container images GPU Operator : Install NVIDIA GPU Operator for GPU management Storage : Set up appropriate storage solutions for data and model artifacts Monitoring : Install Prometheus and Grafana for monitoring 2.
Quick Deployment Guide Follow these steps to deploy your first AI model: # 1. Build and push your model container docker build -t your-registry/ai-model:v1. docker push your-registry/ai-model:v1. Create namespace for AI workloads kubectl create namespace ai-workloads # 3. Apply storage configurations kubectl apply -f storage-config. yaml -n ai-workloads # 4. Deploy the model kubectl apply -f ai-model-deployment. yaml -n ai-workloads # 5. Set up autoscaling kubectl apply -f ai-model-hpa.
yaml -n ai-workloads # 6. Configure monitoring kubectl apply -f monitoring-config. yaml -n ai-workloads # 7. Test the deployment kubectl port-forward service/ai-model-service 8501:8501 -n ai-workloads curl -X POST http://localhost:8501/v1/models/my_model:predict \ -H "Content-Type: application/json" \ -d '{"instances": [[[1. Advanced MLOps Pipeline For production environments, implement a complete MLOps pipeline: # Kubeflow Pipeline for end-to-end ML workflow apiVersion: argoproj.
io/v1alpha1 kind: Workflow metadata: name: ml-pipeline spec: entrypoint: ml-pipeline templates: - name: ml-pipeline dag: tasks: - name: data-preparation template: data-prep - name: model-training template: train-model dependencies: [data-preparation] - name: model-validation template: validate-model dependencies: [model-training] - name: model-deployment template: deploy-model dependencies: [model-validation] - name: monitoring-setup template: setup-monitoring dependencies: [model-deployment] # Template definitions.

- name: data-prep container: image: your-registry/data-prep:latest command: [python, /app/prepare_data. py] - name: train-model resource: action: create manifest: | apiVersion: kubeflow. org/v1 kind: TFJob metadata: name: training-job spec: # TFJob specification. - name: validate-model container: image: your-registry/model-validator:latest command: [python, /app/validate. py] - name: deploy-model resource: action: create manifest: | apiVersion: apps/v1 kind: Deployment metadata: name: model-serving spec: # Deployment specification.

Conclusion The combination of Kubernetes and AI represents a powerful paradigm for modern machine learning operations. By leveraging Kubernetes’ orchestration capabilities, organizations can build scalable, reliable, and cost-effective AI infrastructure that adapts to the demanding requirements of machine learning workloads. As AI continues to evolve and become more central to business operations, Kubernetes provides the foundation for sustainable, production-ready AI deployments.
Whether you’re just starting your AI journey or scaling existing machine learning operations, Kubernetes offers the tools and capabilities needed to succeed in the AI-driven future. The investment in learning and implementing Kubernetes for AI workloads pays dividends in operational efficiency, cost savings, and the ability to innovate rapidly in the competitive landscape of artificial intelligence and machine learning. Ready to transform your AI operations with Kubernetes?
begin with a pilot project, leverage the tools and best practices outlined in this guide, and gradually scale your Kubernetes AI infrastructure as your needs grow. The future of AI is orchestrated, and Kubernetes is leading the way
SOURCE 3: https://portworx.com/knowledge-hub/kubernetes-ai/
Knowledge Hub Accelerate AI Workloads on Kubernetes Running AI and ML Workloads on Kubernetes: A Practical Guide Portworx Team
SOURCE 5: https://pages.run.ai/hubfs/PDFs/Scaling-Up-AI-ML-with-Kubernetes.pdf
%PDF-1.7
%����
84 0 obj
<</Linearized 1/L 579814/O 88/E 412439/N 7/T 578014/H [ 4196 771]>>
endobj
xref
84 195
0000000016 00000 n
0000004967 00000 n
0000005143 00000 n
0000005185 00000 n
0000005219 00000 n
0000006902 00000 n
0000006983 00000 n
0000007121 00000 n
0000007259 00000 n
0000007397 00000 n
0000007535 00000 n
0000007673 00000 n
0000007811 00000 n
0000007949 00000 n
0000008087 00000 n
0000008224 00000 n
0000008360 00000 n
0000008851 00000 n
0000009320 00000 n
0000009738 00000 n
0000009775 00000 n
0000009889 00000 n
0000010001 00000 n
0000010028 00000 n
0000010673 00000 n
0000010937 00000 n
0000011485 00000 n
0000011746 00000 n
0000012054 00000 n
0000012151 00000 n
0000012550 00000 n
0000013055 00000 n
0000015353 00000 n
0000018560 00000 n
0000020444 00000 n
0000021460 00000 n
0000022475 00000 n
0000023534 00000 n
0000023978 00000 n
0000024372 00000 n
0000024874 00000 n
0000026044 00000 n
0000029480 00000 n
0000032130 00000 n
0000032200 00000 n
0000032301 00000 n
0000043583 00000 n
0000043858 00000 n
0000044345 00000 n
0000048314 00000 n
0000058754 00000 n
0000067016 00000 n
0000070786 00000 n
0000070809 00000 n
0000070887 00000 n
0000071001 00000 n
0000071075 00000 n
0000071185 00000 n
0000071306 00000 n
0000071427 00000 n
0000071573 00000 n
0000071944 00000 n
0000072285 00000 n
0000072351 00000 n
0000072479 00000 n
0000072595 00000 n
0000072718 00000 n
0000072741 00000 n
0000072819 00000 n
0000072893 00000 n
0000073249 00000 n
0000073604 00000 n
0000073670 00000 n
0000073786 00000 n
0000073809 00000 n
0000073887 00000 n
0000073961 00000 n
0000074318 00000 n
0000074668 00000 n
0000074734 00000 n
0000074850 00000 n
0000074873 00000 n
0000074951 00000 n
0000075025 00000 n
0000075381 00000 n
0000075733 00000 n
0000075799 00000 n
0000075915 00000 n
0000075938 00000 n
0000076016 00000 n
0000076090 00000 n
0000076445 00000 n
0000076794 00000 n
0000076860 00000 n
0000076976 00000 n
0000076999 00000 n
0000077077 00000 n
0000077151 00000 n
0000077504 00000 n
0000077853 00000 n
0000077919 00000 n
0000078035 00000 n
0000078058 00000 n
0000078136 00000 n
0000078210 00000 n
0000078562 00000 n
0000078914 00000 n
0000078980 00000 n
0000079096 00000 n
0000117843 00000 n
0000117882 00000 n
0000169881 00000 n
0000169920 00000 n
0000170029 00000 n
0000170126 00000 n
0000170272 00000 n
0000170388 00000 n
0000170485 00000 n
0000170631 00000 n
0000171058 00000 n
0000171472 00000 n
0000172013 00000 n
0000172088 00000 n
0000172277 00000 n
0000172352 00000 n
0000172664 00000 n
0000172739 00000 n
0000172852 00000 n
0000172969 00000 n
0000173044 00000 n
0000173157 00000 n
0000192887 00000 n
0000193727 00000 n
0000193802 00000 n
0000211670 00000 n
0000212516 00000 n
0000212873 00000 n
0000212948 00000 n
0000213023 00000 n
0000232678 00000 n
0000233526 00000 n
0000233601 00000 n
0000251407 00000 n
0000252254 00000 n
0000252608 00000 n
0000252683 00000 n
0000252758 00000 n
0000272191 00000 n
0000273044 00000 n
0000273119 00000 n
0000290705 00000 n
0000291544 00000 n
0000291901 00000 n
0000291976 00000 n
0000292051 00000 n
0000311787 00000 n
0000312635 00000 n
0000312710 00000 n
0000330565 00000 n
0000331404 00000 n
0000331756 00000 n
0000331831 00000 n
0000331906 00000 n
0000351198 00000 n
0000352005 00000 n
0000352080 00000 n
0000369561 00000 n
0000370373 00000 n
0000370730 00000 n
0000370805 00000 n
0000370880 00000 n
0000390334 00000 n
0000391177 00000 n
0000391252 00000 n
0000408833 00000 n
0000409663 00000 n
0000410020 00000 n
0000410095 00000 n
0000410221 00000 n
0000410296 00000 n
0000410401 00000 n
0000410498 00000 n
0000410644 00000 n
0000411010 00000 n
0000411414 00000 n
0000411508 00000 n
0000411606 00000 n
0000411729 00000 n
0000411874 00000 n
0000411977 00000 n
0000412087 00000 n
0000412188 00000 n
0000412290 00000 n
0000412380 00000 n
0000004196 00000 n
trailer
<</Size 279/Root 85 0 R/Info 83 0 R/ID[<E2115A8AC53A874ABB5A325E6A5E3FE7><9CAB40EAFA39674E8A6998395ACDF332>]/Prev 578003>>
startxref
0
%%EOF
278 0 obj
<</E 1014/Filter/FlateDecode/I 1030/Length 668/O 998/S 469/T 946>>stream
hބSILSQ=���iKK[JAl;�HkP��"��.�Apa@��`ҍ��Ę8%Wa��&�DR'fĝ��Bְ��_
�/��w�9������Ї!��pU q�B!6�$�ܐ�)UOS��m�>��za�鋭%�Zk��{�q������q�|x�f|th����`*њK��6{��t��/'�B+Y�lv�ESVTj�T�}^O��r��0!�,��r��j�����TF���-+,l7;�Q�r:$E�<>��x���&f\��cKy{�is~V&�&r���Y���)y��ړ^
��7F�9�ޜ�O��`sK:/dokp{s�J-����
�������С��5�^�Π���5]�GpJ�i�+4�C��H=�]���T� ߄�J5=�n����4o�E I�i���EE@��שf� Zp�[/�0<�@+N�\��J�JR}JP4�iOj�E�ʻ��D>�A4��Y�]Q �'�·qL��6��^ Քd�?v2>/젘�c�B��}�2�'H��Ge�N�1_%��|��c����I����[���_D��$��vX�v�z�ʫt��
�*�.��E4���'=��ٹ�B�_�U�O�D����F�EE��t�%���,�<ܛ ƳXy��~������ ���K
endstream
endobj
85 0 obj
<</Lang(he)/Metadata 82 0 R/Names 87 0 R/OpenAction 86 0 R/Outlines 72 0 R/PageLayout/OneColumn/Pages 81 0 R/Type/Catalog/ViewerPreferences<</Direction/L2R>>>>
endobj
86 0 obj
<</D[88 0 R/Fit]/S/GoTo>>
endobj
87 0 obj
<</Dests 80 0 R>>
endobj
88 0 obj
<</Annots 89 0 R/ArtBox[0.0 0.0 595.276 841.89]/BleedBox[0.0 0.0 595.276 841.89]/Contents[115 0 R 116 0 R 117 0 R 118 0 R 119 0 R 120 0 R 124 0 R 125 0 R]/CropBox[0.0 0.0 595.276 841.89]/Group 277 0 R/MediaBox[0.0 0.0 595.276 841.89]/Parent 81 0 R/PieceInfo<</InDesign<</DocumentID<FEFF0078006D0070002E006400690064003A00340066003100350066003900380033002D0061003200390065002D0032003200340034002D0038003100300062002D003700650066006400620036006200660034006600330064>/LastModified<FEFF0044003A00320030003200310030003700310034003000380030003800320035005A>/NumberOfPageItemsInPage 2/NumberofPages 1/OriginalDocumentID<FEFF0078006D0070002E006400690064003A00390035003700310063003900640032002D0065003600300031002D0030006400340038002D0061003000320039002D006200320063003000650035003200330064006400360065>/PageItemUIDToLocationDataMap<</0[3373.0 0.0 3.0 -60.6614 388.63 14.1732 422.362 1.0 0.0 0.0 1.0 -36.5669 405.638]/1[3397.0 1.0 3.0 -432.992 388.772 -74.4095 415.701 1.0 0.0 0.0 1.0 -294.024 410.563]>>/PageTransformationMatrixList<</0[1.0 0.0 0.0 1.0 0.0 0.0]>>/PageUIDList<</0 209>>/PageWidthList<</0 595.276>>>>>>/Resources<</ColorSpace<</CS0 103 0 R>>/ExtGState<</GS0 104 0 R/GS1 105 0 R/GS10 147 0 R/GS2 148 0 R/GS3 149 0 R/GS4 156 0 R/GS5 163 0 R/GS6 170 0 R/GS7 177 0 R/GS8 184 0 R/GS9 191 0 R>>/Font<</C2_0 99 0 R/T1_0 100 0 R/T1_1 121 0 R/TT0 101 0 R/TT1 102 0 R>>/ProcSet[/PDF/Text]/Properties<</MC0 193 0 R/MC1 195 0 R>>/Shading<</Sh0 198 0 R/Sh1 201 0 R>>/XObject<</Fm0 204 0 R/Fm1 206 0 R/Fm2 208 0 R/Fm3 219 0 R/Fm4 227 0 R/Fm5 235 0 R/Fm6 243 0 R/Fm7 251 0 R/Fm8 259 0 R/Fm9 267 0 R>>>>/Rotate 0/Tabs/W/Thumb 73 0 R/TrimBox[0.0 0.0 595.276 841.89]/Type/Page>>
endobj
89 0 obj
[90 0 R 91 0 R 92 0 R 93 0 R 94 0 R 95 0 R 96 0 R 97 0 R 98 0 R]
endobj
90 0 obj
<</A 268 0 R/BS<</S/S/Type/Border/W 0>>/Border[0 0 0]/H/N/Rect[70.6929 298.274 160.576 285.666]/Subtype/Link/Type/Annot>>
endobj
91 0 obj
<</A 269 0 R/BS<</S/S/Type/Border/W 0>>/Border[0 0 0]/H/N/Rect[70.6929 286.274 173.101 273.666]/Subtype/Link/Type/Annot>>
endobj
92 0 obj
<</A 270 0 R/BS<</S/S/Type/Border/W 0>>/Border[0 0 0]/H/N/Rect[70.6929 274.274 292.844 261.666]/Subtype/Link/Type/Annot>>
endobj
93 0 obj
<</A 271 0 R/BS<</S/S/Type/Border/W 0>>/Border[0 0 0]/H/N/Rect[70.6929 262.274 371.033 249.666]/Subtype/Link/Type/Annot>>
endobj
94 0 obj
<</A 272 0 R/BS<</S/S/Type/Border/W 0>>/Border[0 0 0]/H/N/Rect[70.6929 178.274 198.433 165.666]/Subtype/Link/Type/Annot>>
endobj
95 0 obj
<</A 273 0 R/BS<</S/S/Type/Border/W 0>>/Border[0 0 0]/H/N/Rect[70.6929 166.274 202.524 153.666]/Subtype/Link/Type/Annot>>
endobj
96 0 obj
<</A 274 0 R/BS<</S/S/Type/Border/W 0>>/Border[0 0 0]/H/N/Rect[70.6929 154.274 145.269 141.666]/Subtype/Link/Type/Annot>>
endobj
97 0 obj
<</A 275 0 R/BS<</S/S/Type/Border/W 0>>/Border[0 0 0]/H/N/Rect[70.6929 142.274 159.459 129.666]/Subtype/Link/Type/Annot>>
endobj
98 0 obj
<</A 276 0 R/BS<</S/S/Type/Border/W 0>>/Border[0 0 0]/H/N/Rect[70.6929 130.274 143.27 117.666]/Subtype/Link/Type/Annot>>
endobj
99 0 obj
<</BaseFont/SGQGLY+Roboto-Light/DescendantFonts 106 0 R/Encoding/Identity-H/Subtype/Type0/ToUnicode 107 0 R/Type/Font>>
endobj
100 0 obj
<</BaseFont/IWUYBS+CloneRounded-Bd/Encoding 112 0 R/FirstChar 30/FontDescriptor 113 0 R/LastChar 146/Subtype/Type1/ToUnicode 114 0 R/Type/Font/Widths[438 1032 222 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 434 0 597 612 582 620 541 511 611 621 438 0 579 498 725 648 653 571 0 598 552 518 634 0 768 0 542 0 0 0 0 0 0 0 522 560 503 560 517 452 559 562 424 0 530 399 0 564 552 0 0 532 484 439 564 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 251]>>
endobj
101 0 obj
<</BaseFont/OKRIHG+Roboto-Medium/Encoding/WinAnsiEncoding/FirstChar 32/FontDescriptor 108 0 R/LastChar 121/Subtype/TrueType/ToUnicode 109 0 R/Type/Font/Widths[249 0 0 0 0 0 0 0 349 353 0 0 220 328 279 0 0 568 568 568 568 568 568 568 568 0 265 0 0 0 0 0 0 666 631 0 0 0 549 681 710 0 555 630 541 875 710 0 639 0 624 604 607 652 647 0 0 0 0 0 0 0 0 0 0 541 563 523 564 537 354 567 555 255 0 522 255 870 556 569 563 568 352 516 333 556 495 743 503 487]>>
endobj
102 0 obj
<</BaseFont/VELBBS+Roboto-Light/Encoding/WinAnsiEncoding/FirstChar 32/FontDescriptor 110 0 R/LastChar 149/Subtype/TrueType/ToUnicode 111 0 R/Type/Font/Widths[243 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 323]>>
endobj
103 0 obj
[/ICCBased 126 0 R]
endobj
104 0 obj
<</AIS false/BM/Normal/CA 1.0/OP false/OPM 1/SA true/SMask/None/Type/ExtGState/ca 1.0/op false>>
endobj
105 0 obj
<</AIS false/BM/Normal/CA 1.0/OP true/OPM 1/SA true/SMask/None/Type/ExtGState/ca 1.0/op true>>
endobj
106 0 obj
[131 0 R]
endobj
107 0 obj
<</Filter/FlateDecode/Length 574>>stream
H�\�͊�@F�y�Zv/�$U�V)��/��ƙФtc1.|��9�F�cR}��}��n���Τ��k���9Uu������㹪�ܚ�*�������$ix��u�O�d63���k�mQ^��=I��el��l�~���&�ߛ�O�ĺ3���MO��rh�.Ѥñ�]�?���G����G�8'Lq-�9�=��̲�37�m��'�.�{�;��߇vx]�׳�f󁦐B+h���@y��ZC�@�B�s���!Y(@�@�ӑ3_@ZB�����F�
����r KN!�%��ӒS�i�)��rZr
9-9����BNKN!�%��ӒS�i�)�t܃p�{��q�=8�A������S�~���O�s�)~?��a�9a�g�0�3A��� L�L&x&
z�y� 
z��q:
z�4�4�iPi�ӠҠ�A�AO�J�������S�~�_�O��)~?�/��������|�t����,$�@H�)4�V��ȗc��_��r�������~��湌��i>7]qo�~�
�u�nϽV��s�6�����?�_ �jG�
endstream
endobj
108 0 obj
<</Ascent 1056/CapHeight 711/Descent -271/Flags 32/FontBBox[-732 -271 1170 1056]/FontFamily(Roboto Medium)/FontFile2 133 0 R/FontName/OKRIHG+Roboto-Medium/FontStretch/Normal/FontWeight 500/ItalicAngle 0/StemV 120/Type/FontDescriptor/XHeight 528>>
endobj
109 0 obj
<</Filter/FlateDecode/Length 477>>stream
H�\��n�0E�|����"���Z EJ�V�b�j2����C����V�4H ���;�춻��\��f&w��6��p�Mp�p��lY��k�ϫ��9�c�����e
�]��r��t�2ś�[��!�g�{lC�������߻|ǿ���-�j��pLA?��>���vm��M��4���_�1�b�^�L3��2�M�u
Y�H��U��Xe�o���=��͟:fU���tJ�H~?�����%o�/���r�tJ\�pI.�B�'{��ld�O�>嚼N,�K0�p.�\�A�0G�#��sd�y&?��(p:
��G�w��<���������������ѳ�G7eEe�"G���Q�(r�9�e��9tT8*��o��vJG���Q�tT8*��JN��2�|��
���
���
���
���
���
���
���
���� ��sub��]��Fs�1m�y+��;����n�ѥQ�e� y��
endstream
endobj
110 0 obj
<</Ascent 1056/CapHeight 711/Descent -271/Flags 32/FontBBox[-734 -271 1138 1056]/FontFamily(Roboto Light)/FontFile2 134 0 R/FontName/VELBBS+Roboto-Light/FontStretch/Normal/FontWeight 300/ItalicAngle 0/StemV 56/Type/FontDescriptor/XHeight 528>>
endobj
111 0 obj
<</Filter/FlateDecode/Length 237>>stream
H�\��j�0��~
�C�k�a`�e��ڱl��JfXl�8����t0�-���-yj�m�;%�a�!DO8��B�c���W�U��d��w�\pj㐄1 ?�9Za��S�{!��Ba�u�� �%��0P�4�q�Ao6_� +vh=�CY��)>׌�k}��q�㜭C�qDaG散����Q��- �7�R��y~�VZW��&�G�a�-D�n�Z�̄���唁��_ �q�
endstream
endobj
112 0 obj
<</BaseEncoding/WinAnsiEncoding/Differences[30/hyphen.case/T_h]/Type/Encoding>>
endobj
113 0 obj
<</Ascent 1144/CapHeight 670/CharSet(/hyphen.case/T_h/space/question/A/B/C/D/E/F/G/H/I/K/L/M/N/O/P/R/S/T/U/W/Y/a/b/c/d/e/f/g/h/i/k/l/n/o/r/s/t/u/quoteright)/Descent -279/Flags 34/FontBBox[-215 -279 2495 1144]/FontFamily(Clone Rounded Latn)/FontFile3 135 0 R/FontName/IWUYBS+CloneRounded-Bd/FontStretch/Normal/FontWeight 700/ItalicAngle 0/StemV 132/Type/FontDescriptor/XHeight 498>>
endobj
114 0 obj
<</Filter/FlateDecode/Length 434>>stream
H�\��j�0��~
-�E�O���a�L!���d�[�&�Q�E޾���!�'$]}����v7��ĩۇ�����2]c�!��1++��r��wwn�,����e ��x���6�O]�,�f���!<f�G�CƓy���?�|������iL�Z譝��s0y:���u}XnOz�ߎ_�9�*�K�tS.sۅ؎��Յ>��_�i�0������ݟ6fu�]7E�m�_;[���Z���Ym��:(W�
�"���l����B�'{�3��5y
~!��7�
xK��e��i���������������=3����nn�>>����������������������t�����
�
�
�z�x�x�x�x�x�x�x����*�uj�{G�e���W?v��S��D�
c�����l�~٧  �m��
endstream
endobj
115 0 obj
<</Filter/FlateDecode/Length 2226>>stream
H��W]o+�}�_�G��4g�
,��&EH��\_'7���{}�����K�R+� 'A`Ԇ$r�䜙93�]m���;%^�Jrt�6N������<�饻�l� ����Ҧu"�Zm�#C���(6���u7��c�}�l����*���}ӫ�����C���^���uI����#%
$��.r��ƒx�v�ɶK�1|��p�-�N������qz��)�`��K�=1Hu��5���[�5� �1dd��x��ܱ-zjLp�؃[�T��ࠉP��a�j���j�W�B�
�P�ĜOďu=
��Ƅħ����p��>~z~\Dq�ya���X�gW����`�Œ����/�ŏV�}�����^�=���y��C>@,������d�b���]V�[����߿{)���q�?
J�j�v���I��%\�2��D�/E+������,��sSdf�_�����2���}Y�jd�?�Bnl���NU�׽ܪ~M���y鬬���v���&�n<1��㪵��I�[8沷k���jcYIye,l��+�����2ᠲ���=��4�V��fid�L��u/G�8�Ysٻ�*3�=�*�1�h
�a��.�e�k�ƆL�46�YOECz���N
��-�S&ؒ�b��ʬJ�'�N�m�0�8�5�~pV�qUՉ;j䇜�5��0��Ɣ8BH�@*�@�u�`j>���|�t�z��eX+�R(����]b��b��<�ʧ���^�@}Q��7�K>�;�M�����///�P��6���|y{sm*.�K�Z_��L��+���k��$�7��%�)"����d����^�W/�C���ɓլ���=��Zo��4��R�-�a�Ƃ_�k���H�:qL��P~�:4YU.(�?+s��{�]�����jV���%<�F]}�����vJ�zw��[:9��?q�U!�jz����0ڶx�ՒLɿ�5t9�M�0%�@ϸ�_ֶ�����뎟�N
�[>�7k9��JN[�Q��-�v������
́�%F�j��>r��l#�]�����}G� U`��s�=�n:Wn�;��v�������5C���O
��h����&�Hq�Zްr
(�����d��~��q[f�NG�*Z�X��
s�+�`����X����j�����־���ٮv�C���Ľ�U.���픀��h�ؕT�aM[�����]���ۘ� �ǝ�K�ܛO��0�&����v;u��c�������J/�JkM�j��$����n��pv>�-B�뱮���S:I� ��{g�fp:#�n��Ҕ2�^B����@�%jI���j(��o*�w����]�sE�d��q��t_?�?<��z}+.��V=��0������J�F��`ŧ��[�����_E*��� p}yq�%���}���,�!D�-�Z��)�t3�zN��'�A���}e�ٓ�Z��2h�Qj&��pc�S�;�=e�U�n����{���{q��-ӌ%�z�ɼA���Ɛ��I����H�5I+��cv-P�k���V9qތ�О%P�V�|�Q����x�� #�A���&��#���ЀZ=
�!]X�A�f��U�n0>:*������j�0˴+Ř$H.<�K=�"�AF.�1G��82�$�Q9���sF�a�k|��*qi�sI�ԉ@
�¶�9��'�(B�� ��*ic�ц��i/k$Jb��"d��24W�7���>F�A=�H�:Hf�B [bV��j&J�N��F�g��ZK�~B;�)��q2��9�q'(E�S���e؅jb8�|��S��n� ]T�P�碂B@阡%��i�
�
n�S�9E�Q��E�u���H<���|.�&��� ��E��\T �F���%��.�e��QQ�-�I����YRvy�Q�����`[$u3:�9F�pz��9��l��V*턳FF�)�A0������H�3 e"c��#c�9�=+#�P\��� RŁ�Н��¨HaߔY#��o�c�[�e��<�F�A�D�=|�KL֥�꼝�ZäԢ��*lt��F7G�
���H]�8P`.n,\a��xD���4-5H��!��� �1�$�@ޢ�,�,X���54��l��W��9�ۚ�l�}uSH���g���y�q��#G��R8d!2�+7K�)�F��v�� J�锆{�$&p�u
�-��6���Z1 �"�H���!��o �\�3���� �m�
endstream
endobj
116 0 obj
<</Filter/FlateDecode/Length 3135>>stream
H���ͮ�
���)��臢�m�<� ��~�d���@�#W��e{�E��X�D�<���J�ou��k߾��i�V�u�RJ��֢��������_���ۿ����c,nm{����VC�<���z�o?����������?~�������/�W���L�n?ޖZS�-qv�'�jK�żXZ�o?����RN�=���g�.q�y��>Z=��?{Sp�w�I��<�R��O7P�^_��C��"zZM�%+z�"n5����J(�#rO��F������>��{Z�л�+-����s���k#�L�˂����^�i?�����g�[u)��E,�`}\����邏{�x�3�~,��Hh������R��_����ۧ���O!��A��=,JN,���B��S2����[��p1���?ޖ��AW�l�A+�r
����"��v��+����]���c�� ��(w�Q�3 N�F���Xc]y+M%�)�#����Iەsbrn��ܱ�V@`�1�k�����9�*��#p�%��tn<S�����Gn=x��l�*)+��3��K/|�<!��ʳɪN�:,ە٧�p�L��|&"�����ό�;$d�oy�oEEH�������J�Ui�1�nhМ8J�M���J�*.e��5�$a�2U��9|}Z�G�E�[(�N�<���nAԺ�/�����b����7#���
�����s���Z�ݕ�W j���r�z* �.�J�o�>��#���-y�)ÊD "��Ò'�k -�+���]�������L!�D�WLJ.�S�wu�q0� �$`}��2��8G�!e�5���s<��B�ѫ�[9������o�u�T��+�Bl6b;Z[,�;<AH�]Nm&)+�����,"@P������;_�u�ś\�Vk� �bw�iiPH�H���#�H-A�&8>��P���k�؛��G��!�x���l�,w��=��0��>v(FUڲ ��$K�����5��J��"�n��D��v� 0���`���s9?aנ+�<���uT�<[\z���}��,T�$P��4):N��f����>EFM�04p5�Y���c�D�=�ʝ2�
��2�$>޲sRe��ze�-t��гR�>�|�4n�����SB��,!*���^���>� z���}�Y��P5 LO�QRv�S�<�`�ұ�D�`c%��B����ž}��������Ԝ����^f�CH�\Z����X\��.��"rr�� ��5�NA<O��܏`�ʗL�+3pj��ج�"��+�o|��bBC�%�*�/ߎ?E�1�rR�< i|���ɋst�8}A�Vu2���X<I�^@T�=����]���vUݏ�ǭEߐ|�Fí�ҡ�t��ŉ���R���o膤���T�f�?�g�J
��rt�G��s� u�;�t�@�e�S~_

�g��ϵ9
��t<#�Q5���d�F��M��6�4Ҁ\ν-��V���jQ+@W�&��K�\d�1<��F�D/ϸ�H/U��eF�\���Aâ��1)��_���]��_5ĝ���-1
(�;��V�Gn��f��.Q����X���'#��C�LIg���7�dy�M��X�$s_�(�Ik���9��L�F��K�׽cA�}��Ige�!9x�<kCE�!�LQ$�]�I�/�&:"�6Kl�zJ�!@�٢)cﶟ�}��e�t���@i��(%�8nIW` ���O��! ��L*!O��
ҧ��j%^�SĂ~�ef��,�!
V��}��h��
>O^��=���������Pc/��c�u�X��N=�hJ�< Z��ɐc8ȑx��#�o�J�/�D�PO���X�:<
kyV���R6h�
B��;�՟��íS�}T� IǕ�8���xg0��/I_�Zg{�j����%�Hc�4�,L���f�>�����C.��I� 3]�<��ѤJ��y �o��m��)��^��d2�+�zn<�N ]72��4�,EU�y �C)j.�vWhk.O~}x�\���z��H߈�41y��+�8�r+|
�C&~�IƐor��7N�&G��^�L]{��q���K�'"���rP�����ZpȬ�D�����Γtړt��1*O�C�iH�eD���E�v)�$�c�Ox^"X�7�$�1y�b���� �5�1X�V�7I�w�zX�*ǥ#��ΏL�zzw� 
ÊQSU��
W�m�w����q̃i���y�\�}��j.����QE���*�LG����BX�L�OQ�T��
JF��B��q�Q'-ICU���Il�c�D�lj+��$^�>p�1����kv�4,�ן߿?�3��-\S�GN)��ۅs�J�/��s ��T�Dbh�͒�$iVi�DQ�Ry�����Iɍ}� G|$MJ�z�-���C����lPiQ4�h����i�d�1|������Fq6
F�O��/�X��a�n�L��T��r��u�ސ�T�������rDF�Ԟoh8c����*ͯO˾]|Zt��n�Kӟ����#�{�l�>,�F��4L�j>�RwX�<#�'���lc0x�y�M�0WR[��H)#�V��w�F;�c��&t�̨�]C��vY��� b��ڊ�L}h:���b�P�\i*� ��z�����i�^!d��^n��@݊ �s��o��R ����:����w>C���<$,V��4���6���A��Ɯ�n����C.���zj�8`o�w&S{�u󀖤Q
I��B$RQ�| 5OS�Z����� ���Ǯ��=!��N1r��7��m��T���RHH�Π�(�)4�����KQ�^�Ʉ=��ޛ|wZ���&�n��k� 9>�+�J��+��W����B�g�Z���
&���D�z��}}~CM>YΟ@4��T���n���ыt�H s�*q""���[����uYD��9�W�;���z�R�-CiN�h�2��._]����q'N�!ޞ��j���V�A�J`;�1�����A,?��[W&[7���4L�S�i�v
 V�Y��'%uç�_A��m
��A�� ��y�h%�P���4�L&{4d�'��ٷ���s�'5[��+��+x$�{�8�Y����ǟ  ���x
endstream
endobj
117 0 obj
<</Filter/FlateDecode/Length 1812>>stream
H��WMs7��W�,C����6�^2�Ls���!I'͡�\KڕW��q��X�~�O��������D49���-�|�ţ;��ji"ʽ��~W+~����w�v�^�>��깙���'j�jv8S�M;%i�O�h��)|a��ֲI8�YZ�\�S��۶�^r8�4�սZ������D�~ϊ'S��;� a�"���670DS��
�j���y�)�%�m�G�fj$�����G+�Y[�k%��k�J����$�6OSmY5�R�C-�d�3��@��
lkɊ��]�S�6��-=�p�E�u`�H�2��wZ��F�܉S�
�R%32ό,�-rV-���J4�ɥݹn�o�}���A��4\u�)�u��3��. [Õ�uR7)���`G`��֐1d*V��l�-h+X#�lX�yo�)lm�I
*ZS�����Ȁ��= �+�{8��Uua�49Z�32�
r��Í��u�t,�#}�����[fG<�hZ�.p2jWjA�5
�7I��Mz��]M�ߥ_ޤWÕĢ�p�![M���(��KE6��E��(�e�*&=���JW���MYySƮT�u�Q��#~��ϟ�-_�j�7�^�|���ϸ��o/~�@��wa �������ǵv9�b��.����
yAI ~w�C�<��zhM���t���X��<�5Vy��R�sQX�6�"�2����!�{� �G���j6���a�`�T@Gu0*@�8�w��4yG$y�d�I4
�֣Q[�Է�'46B��3�hA���*ܯǰtQa�L�F����7PԒv6��7� � 51� {�)�.��P�`ehx@���GˆN��7sSY`�W`���Ƕ�
8z�6��G�NPm�EU Z�D
z��� �~ T8n�M
~2�U?�p �l�� go�������<�4�m3�A��r�U�1b-@�<5S!`�m1�Nt�Pǘ�:���)@-���G���ӣA�1t���R0��a�9�½���T�����BS��b1ca��}&G�J�M��)��1�b���(#d(P�&�@T[���й�l�%K�
M��a M!(�E}��l��Sn�1g�U��1��d(�����Q���A��;f��lP�����K��I�¼�^hsl�Ɣg(vT�`3�ց�*�Z�
�!�Vg�&:~쿷sо ���^14�ZS�=���h �Ā�0s���y
�A���p��01�D�n�u\A�nv� f�:�ep��:��F@���|cr,���|�I<.�=l��ʂ0�֔���)����.�!�ˑ+-�A�<�������1�
�g��̾��������t���z\��(���3$�D���v�B��@�[�KA�UA��E��jt�s�X��z����99t69�� ����hRhK�v^�ߛY�v^�Y�ᘩ�O�#��
����tR���*y�,y�[5o뚷{�|;S��3�e�3��y���)����b�96��2-74�{�4�6~.M��n �s���v�� {��*�>�)E��#���40���>^�V�=Fa]�L
�D|���s�����sH��D���ۥ��af�8{F�Uy��o�ʞF&.
?���4�<`=N�ږ��w�G]��}pV���d�~��.Nx��pn�|E׽�a=/K��rI��*�jZ��LD���A��3w��Ę���l�\>�o���Ǚ��/c����CB\AI�j��n���_�K&��� ��J �x��u<�I�\l?�q�8r��֖� ���W
endstream
endobj
118 0 obj
<</Filter/FlateDecode/Length 945>>stream
H�ܗm�� ���\ ��1�#��Yi���քiB�$$�̌*�J �}���t�ƀ�g4�:Gz���������w���~ĘNMyLp�a�lB����G>O]~!�����l���<a��ԡ����;�23w�6/�Q�^J� �������ٲ2���פk-M��n��p�`8��K�aF��)�
��l��q[�$��YAq �6��x*�h��`t\gQ!���c5��"����/>;��.8����+ҋ�H/ʻ/�EyW\��u����L�+���y,F�A҄�+&��
5�����p��Q@P�<�p�*�Q�^����`���^���W��a���|~!|��-h#H��48�M8�,�u��,�d4U���o�����2I���hCB�~�T���t��� �h�9��zڿ9�la��J�>l��вHij�
Y��m�Xn��{�9B�!ͭ�l[�'�5zё
u�\u��[m�h6$`�0m�x{O0��Q���ښ���
���������N.�d�h�5��lq�-ΥS�:�E�>$����:�U:ңE��GW������>8\�B�wb�@0-���:�v�4��&��֐bEF}϶�nka�U��C�m9R$�u��:pg�^+8h�s<�p�޸���'oʭZ�%"9R'}O�C9Z��� �c��l�
�{O��zzlN���V� 7��n����|K�I��W;l���ђ�gN�4m�l��]m�M1ĻS��F�o5 �h���rsU9n��{V
A8�/��h��ƢH��҇�,�(������^���Ģ�w%���C��:l ���I�����Ӯʠ��%��y�"/�j�m�6c�m|��p��U>�Z�%ԃ�eh�

T��7Ǧ᷑��2��T��*=��Y�F%��1$ϋ��/� Vo|
endstream
endobj
119 0 obj
<</Filter/FlateDecode/Length 944>>stream
H�ܗQ��0��{�\�(vl�9ƞa�yەV{i��e�B)M�Q%� I�a���y�u�����c$��ɉ�O9��ߧ�Į>���d�zp���]�`�O�� =H�G�z�:�����E����C�����jY�
�=ۈ��R����Y���O��� �O�Wq��ǟ!�O���Uװ���5���i�V��Dd{u��6Ԯ h�H��
k���L�
�mMdw��_��29p�`��^�:S6���� h��S6���`���hi�&c4��!-���0��c�,�}���;(���p��KJh&�f�k�E� �f�g��x*�`!���l�,���d�|8ܒ��>[pfr���^=b(~&��[�
�����"@�����Xг�]b����-������TM{�=OIv��b�nY,ք�N
.�2��p�y����yOݺ%����]+mӅN�e����p1��D�6ܽ*R^�y�}c\�2Z9�eH�G�1n��)`�R���GW�5��Cdd��l���bhq�J}��L��}��!��{�2��u�Y�{8��Xߩc�?,�X�Na9_�z"�Dc��7� �4fu�����=F?�ƭ�d�I w���_��7Ϝ�s4��P*���,�����lz��k��5��-�1�Fr��5�yf� ��0�� �xjE0b� �9��4orp��!z )�l��^4޾�"X��-L��v�r��j���5�t��y3�d��x���e^�z�J����R��I�^��#@��/���ӎGFY?*2�!�娤�r�B;�b��� 
2��0���X�.�_u6s��"L����.�P�0mIw�=ܒ�ԓ����lUL֏f3)M�{7(���נ�-Y�-��婊��8;�9�udXp�����#��x��g�V���"F��o�s� �q
endstream
endobj
120 0 obj
<</Filter/FlateDecode/Length 988>>stream
H�ܗmn�0������")�;C���a��J\۵k;MWg `C�����K�����]N�ñ0��K��~�y���"��#����N"�}�^�.��ۥ�����6N�8ǒ�)*����ғ�.c����^Ăm����ٞ�a�\;L�mN�6��a=�:JT_�R��f���p���U 0i�4����:��j�����t����Хt��t4���9���.ߝ��H�ZL�(̫t�{��L�y����Z��cBfiB�&:��1ES�*�T
��>�/_uU��N��YM� �����S�E`��C/0ۙ"1|����oY۽L�l�pϕ~ .
����Ia��TݧE��Ψ![��ȸ�m�D��q�3N�A�5�����F��7(Z����ra�2�}���g��2�šc�N)�8*�ë-h�`p���o�6�&��L����j�Yޛ�fy��t�Z��h硶�
��8�_v���w���*? *N�iKA�B=K�K^�}��8��;����+m+K��R����H�i6�d�#ڣ6�7&&x+Zti�p���j}���p)ܘ1�¢���D�]���6��v����o���}�} 1�o\��t�l7����fz�#s,����o��
*"&��@-J�
b@�-��e�&���Q\�,pCF��>�����I��Q߻Z�\�r�=M{�Ӿ��o�Y��yO���
���_W��ca� ��%b��\t��S��f��Hy��Yq�/��gp�)��s���N���<,7�/��RN+xO� �O]M ]O�*��CF�c��\$�"���
�Ci�"Nb�wt�}{G��'�©��uw4��Iun�q[�x�S#?��V��+O
.�p@:�ଭ�
��ɡ�p;#1y����p{5���%�gҐq]��%Lw$�?�/�C���"fa���������Zd��]`���W�)�R���sm��r��ml� � vN
endstream
endobj
121 0 obj
<</BaseFont/GORHZW+CloneRounded-Sb/Encoding/WinAnsiEncoding/FirstChar 32/FontDescriptor 122 0 R/LastChar 120/Subtype/Type1/ToUnicode 123 0 R/Type/Font/Widths[228 0 0 0 0 0 0 0 0 0 0 0 0 406 245 352 0 0 0 0 0 0 0 0 0 0 274 0 0 0 0 0 0 590 603 575 613 533 0 604 613 427 466 568 489 717 0 644 0 0 586 543 0 626 0 760 0 0 0 0 0 0 0 0 0 516 556 496 556 512 443 555 555 411 0 518 386 822 556 548 555 0 522 475 429 557 512 694 499]>>
endobj
122 0 obj
<</Ascent 1121/CapHeight 670/CharSet(/space/hyphen/period/slash/colon/A/B/C/D/E/G/H/I/J/K/L/M/O/R/S/U/W/a/b/c/d/e/f/g/h/i/k/l/m/n/o/p/r/s/t/u/v/w/x)/Descent -271/Flags 34/FontBBox[-202 -271 2388 1121]/FontFamily(Clone Rounded Latn Sb)/FontFile3 132 0 R/FontName/GORHZW+CloneRounded-Sb/FontStretch/Normal/FontWeight 600/ItalicAngle 0/StemV 116/Type/FontDescriptor/XHeight 495>>
endobj
123 0 obj
<</Filter/FlateDecode/Length 431>>stream
H�\��j�0����l/�G�`m�B.����8�$54�Q������.�!�g��W��v��V?���u��!�I/�5ujz�Yֶ����w�v2U.��.��w�8���կ�y����=��A�M�#���x�w6�{[�����g��]����z̍�������*e�>���!�����mR[��%e�����v��xR�,��[>�Fc�߾s,;��6���ŋE^2o�[�+��F�
��sἘ�-�%sM��+�
������H~?�����+�z!��7�
��Ύ���>>�>>���,�,�ZA��VP+�"�"�#�#B0{J��\�\�\�\�,�,�,�,�,�,��/x��\�\��+�}zxzxzxzxzxzxz��9�<��k.�kJy$�gPfS8D��R�q��
?�W� Qq��
endstream
endobj
124 0 obj
<</Filter/FlateDecode/Length 1098>>stream
H��WM��6��W�h�3����l�K�h���m��n�6����%Y�ڑwmc����!)�=����Rr�������Fv��͟��7���IخU����e�k���X�&v)3���=<m��i�ٌ�p�R�r�%�7�Y�R�S��7�
��b���d2m�j��h�5d^ ��q�p�X�
(\�R+B*��&j%�`�Z_��8��i����0���-��5PY�K���Q>���#~x�Z�H�P��<�gْh�Ơ ���7�
��'
����Ȼ�!�F�
yפ��i� i�τ�(�r��wI��Q�>)����.�*���Rj J�)W��x<|����#3�:w���p�� ���B�srj)�kx�8K.'���L��PG����V��/�7#u8�m��r�O���՘��c��+�˪�+��%ݫD��JM�T�|�h%Fy���s��L�P@C&�,+�6�;�l\�R֨�J�'>�HQ�8�;˅�\��إuz`D��H��x�� xQ��Kh>�&]4�(�|a���:�B�OP�����Z�����@N�����rhKO�R:B��tx�קÉc�������;l[J�Dx?�߼bK�HO2��Uƥ��;d����?�,��� ����+��қ��j�Gc�����"��֕4��3z1g(�a�.VT�a���u�j1�Jﶥ�Qv+�@��Y&z�<��"od����#� �0�2�Nv͐m�k}�^�ޑsn�>I�+(��bs�B-�4#��Yʟ�,�J�(4#�����J���4�
{��7�]߰w#���k�g;���+� � �\��\�t���Z�`B��Jr�~����C�����?������+Z~����Su�c�?�Cߧ��>�����������h�E4A��gb��)5���¸��)�JO>>;O�����\�;�Jje�{�t {�ux���ٞ����z�1��~�l}���̓��-��)�Cu�[ȗ�b�Q(t?�T�$A�
�Z3zk�Ǎ �` e&@��i�@�w۲���<�y�ڬ�#I��ٓ��ې-#
-��f�����E�[�G�U�;� C&��,�a��` �
{k
endstream
endobj
125 0 obj
<</Filter/FlateDecode/Length 3364>>stream
H��WK�$�
��)��П�1|�/�0|�AQ�=oc40��LQd�����?y\e�w�W�K��bmS���}�\��]9�wN��&�d�e�#~_�۟��ǮZ������8�x\���ݎ9uj{�~Y��y������+筽]��u\ޮ����֮� ��.~_�<�����������;���r�2��Z�J������W��j�ϗ-hOW�g@q�4̋Ql��I��5�Juf%h|��.Zt�W#빧�����V�_���+������
v�Sn��خ�\�np�WˌvM�a" �Y���~���ۯ~�.���6�Z��S��i?
<�c�i�g���6�P��/>���e;AA��[����3�UV B�h�cuKdȎr�� �ވN���<���#��g2l7=K6 �A��g�F.��T�L�����?���+�io�V�;ki{a����`T��6/�_Q��]-��7x�����'j !_��ł�
Z�**�pZ݈�pJ � 1��3n�e�~����]!^� �[9��Zox-�QJ�S]"�H��WT�#H��J��Yj����}�eIJG~�+->7�:c_mj�}�xW���(D"�ն�!�1������J��w��Ӈ(��k!/�kU��x�^@��@\<���gL�y$I}i���剺���$D+�tT�kwT5��Z?�"㾛�-y/�[�9��Rh>s)n�s)��s)쎹�m�c.qХ�d��s՞�!�e����=C���2�<G��zctn��]�;��e�����^>��C��pO>���婛�ڔF���E]������}V%%
�SY�β;�9���i�9�
J�da��/D��_�T������I7��ȍ˺�D��=-%Y�љ�x-��'�n�
�zqN&R�`��64��>��p�߂Ho�]��)ۣV�F;QD9�G��ϛ�L���ܒ'OȞZq��.�FVƥ��a�gt�{�3�I̘�&f�p]71���˼�^V1���e!
^v� ^�7/�ʃ��՛��a��m��/VV���!���1��mճ$�\���yR��+�F��w��q"D&�=��,K�X���iɔ��B�燣�+$yR��5�<|�S��bVsc�g��U$�(J��VD-Q�S�Z��Q����n�M`�
�"[T��6���,�wX/�b�и$�_f=oA���C���<
ݡr���p�2�D�6D֡�¿ .�!r��
�IX-�Ee�2�er��G0�w��Y�:2� �:,��QW�A�l#&����.�%�����`���K����/%IST��X3YE*Zs���G?J�*@��d#�J�7��ԚM��D�G�:3��AP��62?qȢ���;)��%0 {��٫B!Ef�TWJ�;�&�uI��8,�[&����t� >U���F*9h�6��گ>���n�~�����C�NqU�e|����fй̘� L��E�9��\?����ҽ��wzn5l�b�eu���
w�_f�#���F�!I1�*/À��@���*�N���<���V�4�����`,�k��-�ט�����#'R��D�ʒ�tK��ZР���O�_5*�tP�B�$��%LM&�7��tߏ2���A�x��C�z���-�h��{GkB��
;#]���5�sj��&�ju�"�����vɅ��
��9�}ǪD��c�r�'
I��X���N�?]SEL�*�,Hl�nCC�f���3�Dq�A]N �n�
 �����m�)��a�$)alᤇ�H�M��tjU�0�Ш��O|C�����Ͼ}��&K'*L@8��մ��R�r��<Ik?{*�����U�H�~�9
+����>���Hx�Ҏ��8?9lWu�ƙ5C�V.LJ疹©o�Er��EgVjވ��S뗞{RÞ�S��%��R*w�T���x��Z']lm����j�
������MVV B�a!�O�|n|���f-<�J١@Իx�/�3�v<���<C�$`�3��B1�q���?������+�v�Y�}��X�1KXݒ�@�����ĥ��3��?��y����sd���xnm����$�@�,�i����?i(#�Cw8�E�JѢ�8�=�5nS������dU�Lϸ�I��"ڲ������V@ބFM u=P���V����l�i�->,����P��z�[9��6ǟ�P���Fеӊ�6�*A<36D~2D߉��*�G�3�mb����#.
jѴ��s�M�v��j$V��ֳw��!g�w0�ث�ʢq���+s׸F�U�ZC�
-r�yfq_|f��#P�bk]g�g��]a���.����%*{��j�1�u®��X��GC�kZ(8��r��\�&���Y
 ��<�ۤ�E���R��u4�%��Cs����j�SZ��*�#"�Sm�a-JM.�w�ıH��)hA �龄$���<�)3��jP��QDE[��SWso{(q�Q`%p �
�+ef?��8�����p�YV5��ˊ�γ�2�r��V��s��(i��`4c��1�TG�r ��>�a��c���{����Z��p����� ���?��K7��s=�=b8���Ξ��Ѿ�:�;��4����" �������o1��I�ATsJXQ�$vP�����V�c���-d�Z�LC��m�*{'_"�o_�ʛ����&���#c5d̘!3�����'����u��Q4�b%���1]5�U�@��~��ɡ����ǂzh�'� !�*=�P[Կ�����)'N�xvgFc���j'�ьBB&e�p� �hX��`��hTSΥK���zY49�+�����ݖ��Il� �ׄY�(��R7� ���1�z�c*��xzV��>.�B�> qҋt�"���+h�#�����b�wb]D�!n��j�4i�%ec�ހ�E
<wv���ϵr�h�jU[1��Vj��(�l�槭Tm]V�mٽ�e^�����d�D�I�6�Q�
����&Ll�m�
��؀�X���P"�e6�IFU��ͅ����>��R��A�T5xII��5D9TԐ�[~)�Ǡ���ʫfA?�
j�qw�3��*G�4g5i��2���Y<@*a�ЎU.�خ��e[��fZ�1���gq���sC�-�*�����FM)a���;U+shcj����*ŝj�X%u$�iGv����m����yc_5Zي�s�ޝ8�ST�h����׍�rY����1o���6v*��I�n�ܿwry��ù����j
� �G�}��沚|�H�,HS.�������������ˍR~n���]�^�t���N�G�C�.�M?�ᷧQ�0��v��?����(�D�����ݬ�_� X=V�
endstream
endobj
126 0 obj
<</Filter/FlateDecode/Length 2574/N 3>>stream
H���yTSw�oɞ����c
[���5la�QIBH�ADED���2�mtFOE�.�c��}���0��8�׎�8G�Ng�����9�w���߽��� �'����0 �֠�J��b�  
  2y�.-;!���K�Z� ���^�i�"L��0���-��
 @8(��r�;q��7�L��y��&�Q��q�4�j���|�9��
�V��)g�B�0�i�W��8#�8wթ��8_�٥ʨQ����Q�j@�&�A)/��g�>'K�� �t�;\��
ӥ$պF�ZUn����(4T�%)뫔�0C&�����Z��i���8��bx��E���B�;�����P���ӓ̹�A�om?�W=
�x������- �����[��� 0����}��y)7ta�����>j���T�7���@���tܛ�`q�2��ʀ��&���6�Z�L�Ą?
�_��yxg)˔z���çL�U���*�u�Sk�Se�O4?׸�c����.� � �� R�
߁��-��2�5������ ��S�>ӣV����d�`r��n~��Y�&�+`��;�A4�� ���A9� =�-�t��l�`;��~p���� �Gp| ��[`L��`<� "A�YA�+��Cb(��R�,� *�T�2B-�
�ꇆ��n���Q�t�}MA�0�al������S�x ��k�&�^���>�0|>_�'��,�G!"F$H:R��!z��F�Qd?r9�\A&�G���rQ��h������E��]�a�4z�Bg�����E#H �*B=��0H�I��p�p�0MxJ$�D1��D, V���ĭ����KĻ�Y�dE�"E��I2���E�B�G��t�4MzN�����r!YK� ���?%_&�#���(��0J:EAi��Q�(�()ӔWT6U@���P+���!�~��m���D�e�Դ�!��h�Ӧh/��']B/����ҏӿ�?a0n�hF!��X���8����܌k�c&5S�����6�l��Ia�2c�K�M�A�!�E�#��ƒ�d�V��(�k��e���l
����}�}�C�q�9
N'��)�].�u�J�r�
��w�G� xR^���[�oƜch�g�`>b���$���*~� �:����E���b��~���,m,�-��ݖ,�Y��¬�*�6X�[ݱF�=�3�뭷Y��~dó ���t���i�z�f�6�~`{�v���.�Ng����#{�}�}��������j������c1X6���fm���;'_9 �r�:�8�q�:��˜�O:ϸ8������u��Jq���nv=���M����m����R 4 �
n�3ܣ�k�Gݯz=��[=��=�<�=G</z�^�^j��^�� ޡ�Z�Q�B�0FX'�+������t���<�u�-���{���_�_�ߘ�-G�,�}���/���Hh8�m�W�2p[����AiA��N�#8$X�?�A�KHI�{!7�<q��W�y(!46�-���a�a���a�W�� ��@�@�`l���YĎ��H,�$����(�(Y�h�7��ъ���b<b*b��<�����~�L&Y&9��%�u�M�s�s��NpJP%�M�IJlN<�DHJIڐtCj'�KwKg�C��%�N��d��|�ꙪO=��%�mL���u�v�x:H��oL��!Ȩ��C&13#s$�/Y����������=�Osbs�rn��sO�1��v�=ˏ��ϟ\�h٢���#��¼����oZ<]T�Ut}�`IÒsK��V-���Y,+>TB(�/�S�,]6*�-���W:#��7�*���e��^YDY�}U�j��AyT�`�#�D=���"�b{ų���+�ʯ:�!kJ4G�m��t�}uC�%���K7YV��fF���Y�.�=b��?S��ƕƩ�Ⱥ����y���
چ���k�5%4��m�7�lqlio�Z�lG+�Z�z�͹��mzy��]�����?u�u�w|�"űN���wW&���e֥ﺱ*|����j��5k��yݭ���ǯg��^y�kEk�����l�D_p߶������7Dm����o꿻1m��l�{��Mś�
n�L�l�<9��O �[����$�����h�՛B��������d�Ҟ@��������i�ءG���&����v��V�ǥ8��������n��R�ĩ7�������u��\�ЭD���-������ �u��`�ֲK�³8���%�������y��h��Y�ѹJ�º;���.���!������
�����z���p���g���_���X���Q���K���F���Aǿ�=ȼ�:ɹ�8ʷ�6˶�5̵�5͵�6ζ�7ϸ�9к�<Ѿ�?���D���I���N���U���\���d���l���v��ۀ�܊�ݖ�ޢ�)߯�6��D���S���c���s����
����2��F���[���p������(��@���X���r������4���P���m��������8���W���w����)���K���m�� ����
endstream
endobj
127 0 obj
<</Ordering(Identity)/Registry(Adobe)/Supplement 0>>
endobj
128 0 obj
<</Filter/FlateDecode/Length 31>>stream
H���������+����c � S|  �r �
endstream
endobj
129 0 obj
<</Filter/FlateDecode/Length 11195/Length1 21284>>stream
H�lV
PT�>����O������"f�]\v��5L�O��X�ٍ��ſ��?�fd6Tklj�ֿh���w�Ѣ��6j36�&�?�d�N�TC�G��]4{�;��{�w���y �& Z�k���.Ԝ�_`��k��q? �D�W۸�aK��(��߹%��׎̞� �8[�jV������~o*�
{P�
场�5����}��`~nي���~*@�d Cv��`�v�0`Z�._�P��/��- tQ㪚�W\)�����ǃ � � �6ɍ�g�pj)���?��U�u����i�ʡ�/��V�Fq��k�x��`ňء^� ̂�0�C+|�s ��n4�0ӽ ���$u�����,�d�a��T�y��0iE�47@�o`�`�J_���v��*+�
��8����FNF��'�2&�*���淆��I�!k��na5G�f\� �]VU�zg�V�<z����;��͈13!?X�o`i� ��:�䨰2!��7�ǚJ,���oQk);_�c�K,���d�Gq�T?<�V�`�����|����
�%�B!K=���� <�(NT`J�ISel�ɦX�¦�D�/q2����W��hp0{��
q�<��:£I�5T�;S",n�A�����fC�֖v鸗IV��n��|�<(���<�v�߉l�F�=��0�z
)�"2T6M��P�A'5�Q�:1�>F]�0͞� �$O�GD
x2"�'m|��&f�W$�Tf�7�ŨFB�DP��(³� �W�J=K�vSAU �F%�sD�F7�u�i0:��o��C߿�Jy�B!<��f+r=
3���o6t2�+,�̐�S�,��2�� ��,��e��!lO�g���b~��B�ش�T��62דnNs��z<�����T2��Ԋ4��7zx���
G.�=��nFU=�x�o�`��Y5KfͨSu�O��N�h)o:q,��\�4o}���/�~u<T�C�4?�~Ѥ�ڗ��W��V�N40��
3c���.���hM���dJS�&S�6���Ʈ�Y��V���_Tgm�j�/~J�������y����Uu�zc�I��G@A�mѶ�4l�v2�&fJ���&�����Ei&�
׷f-�e p<���z#��M�^}{�2�K�q�l%��)SԷ�jn{�z��`��"r�s�E)1Σ�Ew���|��V�W�J��M��T��2=��Sԅ}(�Q<
�U���V��ݻ�� �t�'�I�ER�i�mE<u<q���c�T:_��9��Bv_3���aha0���m��Z
,ۤq��+<�.@X���!3+V
23�בO*� p���L���y%S�H*e�{�i��%��h�R����]_
ݟuu����>B�:x�����8�G$�&�+�_5=z�>$�k�[!��Na/�'!"��2��!���cX*p-��(yF��頺��3K�ݍ�hߤ������3,1�p�F�j|�D팈�X�0�a}i1-o!
���ז���ucݙ5Z��#z�7��}j݊��?�疃�R�K�;��B���t����N����A��0[�cl�d:��0�K���B&ɔ9(�, d^ą�;��BW2Y���3c;��$·����L9�3(��/�ŧ��x�����-w���Kڦ��I�o��.o���Ꚗ��n��.��7���8FL�Rպ�����]��Î�3M�u_�́=��q�~�S��6@2L���GO�n�(�1��b��0MH�$�̆tFt�!�&���H�mF̐�(F�Pw�V0ZE7G����F�1i,z{G �s9����G�G2��y����0I($�J��&rPK�86�+bL��eIr؜�R+�3�gŶcs��*���hw�@l��>-�]ѝ�?�x���{w����v�;i����ޡ�V���>��K��߿�K�;x9o"��6�C'u@ؠ&"��p���W~��������9��Et��\Iǟ�� Τ���A�I�ᇞ��
�<F �B� W��d��cy����o-����C�I�g�.*��k=yR�W?R�]5G}p}G��$��I1ڶ����{;��N���s����X��3���@� ����h����.�� �+���
ir-�ԥ5=V`~�:�9�������1�?zf��<pa����v=�1;V��W��W�}����v���)��a������O�aB�y
�E�|�� ���'��㢸���;��,��>�����F�]���h�C�Q�i�&�y���5�*��$F�G|G|D@)e�EQ4_�XD��(Q1�Vm�����݇;����wXf�{���9_�RGQ��=���"e�&RW/�Y��qe�L�"�؞S�o����¬��/����Yp�RcEzUlLY��
���%����|���;el�J9�G�C��a�,��b��~�޾���(h`�/
X(
�Aø�0��/��FW�W�S�[X���!:��h�pу�z���g�8<=�p���_z@� ŀ��HaZ�s�[W�+���}�qm��;��I�)d��,��c�f����ƞ�+���- $Bf3�8��j�s�>� f�o�;7�`��
?��%e�"�K�Fr��W=�H��9lq2���Be�R$������/�'8�j6]i8~r'8�5���ꆩHP�_� �&^IO?���#�
]�(�l4,���QII4R��Q������r8{�!�/��ޜ��-p�����F���'���mE�.�#����v��L��'�x�Bu�����_�<=oFk;�&�Su�l�kU쯤�Y�j�z�U=D� �Ỳ���lWQ�B��HAMsaaP)9I���|�Y��[1P��d��2���e,�x!V�BI!�[�J9�>dwi
�!ѮG�)i�ϰu6�f8��hrm"ɐ��c���a���́j��#�OEl��L�Z��om~��&a���81.
�[쯥�a�O��:�&@����7�-�%�h�ۍa`�s��}��MdJ�V^��,F�7����
�ъ�K徭G/�
�xǪ�[?�/�^������77R�����M�k�ʀZ]�A޻=��* ��uH��U0ENXBC`B�Pكܺ��8e�v�F���ϓ��ǎ7������*4 O��f��!:�������!@_Å@^
 5Q�Bt����:Q�W+@�S� ���~H<gݏ6���۷���Ϩ{3
%w��p�ڪ%���|Ũ3����<�ɀ�6���;� ���'%�s
P@�#�C��3�,�Q��!�����|�s�����`�'�%O/Cj��g4��f�O
�\���[�<�l�&��%·� �U�H�w��,w�z�M$7E�DY|�����7b0��_�}�0R��/E���MIeR��SN����bҕ����]?��~C�Ah0�W����׹�3wS볶�x�B�b�{rR>P�š)7N~��4���re6@i�[�IN��$e3��c�3V+Y����p��0PD�tz�К�<b��#��_W8�x%���4��p�l����=ʆ����U��Q0�>s/�
��w�$ǒ�`��3��������[O~ݾk��<��ܣ�۶�����O�1�Z�{��fln�R�|$�PTzUX�P!FQ�;k���9�6��\J����4g��*Pp���pVw(�m(�s�MO�fq?GicZ>��d�ˬ; ��G6xp��U�K �0���2���&��W�=P�6E�'�ޡP�����ڝ�KZ(}�>M����ǈ(P�CYeY!]R��oX����Y������<��ο>Oh�T8:��P����4��F��p@Ʈ2�hg�\Cz�C*Hk$�U�%B0�T:�:Wg�IN����B�^�0�P6o�{�������8�$��G�Pȶ3�4�!�!?���D�P,�x|a
���81�{�'#h=U38: ��Gn)� /�&(���`��m��m�fd����Jj#+�첊��d��T�p�<}�JrѦ�e�f���cn�!0e��SV���K���t��^f���҈Nh�*�tka�;��X��\���o�Lxk�V"�������������Y������ d�G�ͣ�據������=�I=��a=�>Bu���`A��`��L'�`�&�0�O�]s#�3n ����[H���,r>Fss*�����=)W�v:�Bi}>���\]4؜�[�$Q�\_����7�W�մW���=�������#�w��hY���,V�Q�L �Ey���5j^^��ۊ���u�x����T�(�T���f�Zlo�,�AIsW,�����>�ξ~�����Sg~=�������
��x8�u,�u�S�c�!3�Z/�`��H��t���^�� U�\�,��熉
��k��3�n�s��
��=4"a�^�C�66�ż�(�$�����M|�Ӻ���}|#�}h2�=g�j��ue�'k���E0,��&��cܗ v��L�`3�W��M��LDC��_$��T��9d_���C���k
 �s��k�xa���+��ܠ.��}рCn_@�Nj6�!:�R�o���o�{:gI���Ϧ]�8� a,L@��L�Kgz�&x��gW��=���k���oq��Z�.<���&-�Ƹ0�B6rР%�/0Y�� �
q��@�L}wSH4ć!QJJz~�A1�ش-G���⪬��im%{�x3 H;�?ƫ(������rp����ɝ�F80@4Q��uh�D�V!bA@���D��S� (��� x,&�F�1�U��O��?���5��mF�[�~�rp{w��������=���\�<�V��_g���:R��vm6^w��="j���k�s�g֔��Jr�>t#�#�G�a���t4����F6�3
N�'߂
_�.ez!!�ʻBߚ�D�$.5� �:2��{�����e�'�Y�5���Ͼ�N+�o��G���8�^���X�~]�;�b7Tq�-h�>���p�07#��ԁZeN���LǓc,��DZ ��yp2�L��rŲ�E_>-��I�VU�j]���3��4o�<<�?��u���4=�u��t�J32:�:U���L�q#�t�,WA
VE3M/�iqůO�Me�$G�y����t$���~���TQ~�T�k�3�����َcژ�h+l,��������� �l��%�؀�A���!�-�ǅ��'EWө�s�����!H�Oj7�H�i(�`#�$�l�1tJ��db��}oe���g��ۯ�,ܞ�^#��u4��W���1�����i�#��1�����U�t���T��ͰX�������a�D���"����!BB#�h��l����e�Š�:���wvhLKQOJ�[�Qdo��'��V�����ў3�k��0dBuB�yIU��6�Uw�F�y�:R;t�D&u�W�e2�:�J�?�+o�h϶Jr4�$Z�0��ÆZ�N9_��eS��9�c?[~��}�l��UB�M��mM�/�'?�妎�
-8vPq������1ԩ !��E�^|��D� /sB��sN���=�*I0�^�ĤA��`�H��u}ʑ����WՖ|8���]����iG2sv���� j�.4O2h�����#��6��b"=��!�"�W�Mj<��8)8��4�H��!vք �b�d�Bd\\�ĉ����b:��}Q0J4��F�ֆ��(#f���j�r!-��TȔ�-�E�' �� �x��M��L�D!�k6��p��w���i.rG��VZ�Pe�����yjt�0w�4ܓ�8>�j�@��W1Ù��Iԧ��z���j-��&�F��}���Q���HBM" �?�>�[�|�4�Jb�4P
L�YED�0�0��=)-̍��!A��X8���H�Ku��+�0��H�f�i3w%Vs���b4=��
<Oi��� >V���l���%�rs���5��̹m���+ ̕����8¸d��@�z�)h���#FYX�}C)�F©��F6G�A�~܋�,u$.��B�Adt�pF@��k��=c�����3ײM`F�)��A���rB%����uv՝M7�o���빽{�������̄��������
8�_}���n�ʿ�
\��H\�1e8*�cƺ�"�ٓ�
�a��Bb%��zWHa�
��A���Dbz�ݭ�,�W�=u�zp��]�Ŵ7���qS���į���K�O���K�$٫4�ѨX�t^��>~z�о�z�_I��z�!�^F��˖���2��Zq�/��츱p���ƃt7�n�71���R����S؇��f�C~h�0�_;�ײz�(hX�B��Ⱥ��*${x�d������#*W0�L�^S��t�r������A5�۟��Mf��u�0���S��Q�w8F��g��9b{�]v���bw3����6���R�O;���"��}���[��U[*qJ�;��GV�޺U�a}Vыs�e�m�ܺ`uafF֫����tSእ$���2�(�2��\��]���p�;8hHn1�r��������v�d�a����⃢t�4"�t����_�;M�Q]z��b��(��=�'W�e#s%�;�
�K�(C �9�Sֶ���4���$ �?i^�ꧪ6�6ޘD�3�Y���0Sُ��������0's�7X��.��L�hx4Y@J���Q��N
H��|�]�{�_��r�%���t�C%���>�,/�*ku�P�����[��I�h� ��5$� ��������
wW�g
ć��W vU�����
�)]lvJ��UB�Ȅ G��xI�#S+NpN' ���.,��R�#iN%I@~��8z��
�i����Z����ǟ:;����D��� "����h�� �K�Ȁ�ܸ����y��7+�t2@���=����I!Y�yO�[l�����n�|�/�}��� ��!3��@#!��$�9��EJm���[�BI��#,A���6f�������e���D��v��
D3�Ь�/!�n5Ӯ����
V TP�A����D> ��^P�}��ٸ(p��WE�|�r6[���WlX[:��.4�K�:TJ��U��\�Dp�\A|P`��l��KO��]�P�q9�$x� �`�� ;"�Ҹtf<̈́k�3q-�Z���} �Y�H��傖�����iL{�r�[����AP������`o[�z�Z$�P��H����� ������Ez���c�m|s���f��,i;��E,8<�l;�d@%�>$�;����OF�Fo4�`r��.�?�U��u�����~��X-j���@B%� (Fqp!�.
e�M�
����K����A���R
8�鴶�3��t�q&�ژ41nMlm���2C�����������{�y݌��-�=�<�ߌ�ߪ~�v�ŖO��M^�m��67'����N����J�kޘ�Пlؕ�>-�������@���}�����.���R����R3�ʰ.e�Q���=�~֧�e���C�]�0��߶��m
#�O���'�4:D�kn�?�1.tI�q�� �AGǺ�`Y�к���+�'C���G�N��8f����^��;�t��;�k�-��?�yt�c�k5UF�ـ��ѓ!}:�{r����z��tiƽ�x��(�u����j�Vȯ�a�a��%f|E*��[0�؎0s�_�T<�!��K4ˉdb���x�H#R���h�B����
�#�/��������un�E��f5 -rQH=��-�/>���zr<-�+�v�HC����<���9,���Y5��6�Z��$��y��_�� J�xQ��0gb����X!�"^�B����2��)8l\�>��A������2���8�E��H��f���A�Fj��
���\h� �8�&J��|.��X'˰X]`�}0�8�*�W,+Q�S�.�qD���:��i(�\M����Hs
�e���|����d��,ʱM%��a��=k� ,�f�KqO;~o�-ـ�<��#/%�����˴c/2�f��.�\Ș>����r�:G�<dX)�7�Q�!߬t�Q����j�7��w �'�qTD`�H��I(f�����&6 M(䚙8����%��G+(�P&��Wp��O��U�A�J�Z5��Dr�'�(�U����<ʕ� �9�(��@�+��ۘ��J���R�f^�����G�U�k�i$*T>V2��A��*g���,LT��5[]+���E��v)4����z0~���YU �����R�Ь���K���qZ�u�O��M\o�5���hW�� �w?��~�aO������9F��G�wt�����,���Td�h��tT���&�� �~�r��g�����o�5�;�:� ���㈌t_�F���>j�e��1�Ҹ�5.�8��P�:�v+��19���|�_1wna���ɏ�KV����=^[�amC[?�v�{��H�s�:�ᯚpV�]�C��oY{*d2�,$G�h�A�5�z<�hr��1��r��Z�U�V��^�����I�����1����;�� !�>��=���1X�� �L5�r)P��.[��:kOD�:��@u��1_T#�(c�o�}�z��
�4;0Pl��ܧA̹�:Q��0����hANMd[g1Ug#غ�s�0��]l���>��'0����1�g.��� �� �K��D��8�1�&����"A{g�7�b�
5U:�
�H&&I��6S��\�s.����&֙�(��V��ֈA��>b�$ּ$$����Z*��2$�Q̷_���S��|D޲0_�O|�3�c���0��o�G���y�w���b��%�*
Y�rY��e)�N�Ir.w㸌�W�%�]D�R�����H��a���]�Ƹ�<��p����:�z��j��5�\�g^g��n�:J����� (%���U�r������sx�>���x>��3_<M�f1W�z�7���5��oP�;���\\B��1��J� ��{��_4R�״ߥ{)��kU �C�D!k�0������s�h��y�>�X7����=vT�I�|�'�(L��(׉�\�vs,��A��A�������Y�wR��8��d>�r��}}����Q������g�m��6�[�o����F�D�HL&^"f�D�^l��!��o��"pF
�9�5��?凌}!��2�r>��?ဨB1k�[��8��]*=�B���؄bQ�Zo߿�S"�H$�}�����W�\�c}.T�QȻ�(�k3�|�_6��r4fq�}�^��oҿ��6��;�'���`b��7d�9"�XB,��F�Sw�q��}j��~�ܫ���Y|���w�D"�~�\Glb���X�ٓ��ҟl�1�R�@/'o�X_en3��~���T,��5`�D�Kz9}֏����wyM_wq�����ou��o�=Տ��l��~��FUD����v[�R�h���J[PQ*�K� -j�hK�K��Ͷ� MJ��BbPĈ�D����@Hx�#1(�Dx >4b&$����νn�l�D|؝�9gg��Ϝ�})����q�<䄃���*U[Ad�;M˺0^F
����)k�\�hbR�CF
�J̈�:�u���-�Ч��ӌ3�-蓾����/`[�$�[bL��a��u����GD����?���~L�}�C�j�F�~����Yu�M��� r�8������ż#rn��k�T�RY1i���},�~F��I����'� ��ȻI��T��O�{�����1rQ�09�s A2H<�J���R$u~�+�0^�
�Ŗ�uh�X�5Q�l�{�����⮮�� [��&�w�[�M����e���|�wC�܋~Clbq�ob&�����)���]��ȕ0��c9��n� �ϻ�1�O�A��Ol�̏�
�|Nȼk�E~p-�1e~��|���6��O�|��u��q���/���.�k�n�mt�ނ�M��9 �����=�.�CK���'������ߒ1�k����������E|
>F��9}s���mߡq���S�%��\��F8x�p�8�k����Y����{ta�z��)ğ��p��hR�f�[�iʪ��cz8�N��c�^�1��@��|���A\�\��yUU�Nyk�?=.�}��.��������.: �����<������=N��пg�7���,��PJ,���N굷z��}U�.��1u<�ccJ�dl�ߓmľ�1��&�^W��sl��]{�÷���O���N��ʬ�=_[�<k�9�fӤn������߁�_J�|�o��k� ��ĉ�$�g;�۱����D�qE�k�=b�y��-���.��ǯ$�#g w!f������_�[�$v~�@���H�3�g%���a�����M��]���3ɳ�s�;ǻ����|._��?�����\��������P�:�=x,�4�9�T�
���n�n�@�96�Gå���?./�_x�hRQsѶ�k�j�
��Q�T�n��du�Pɹ�i�]�ߔ^ͥ\����R��ْ�o��i}�t����T.�R.�R.���/)L"�U�jR^��/��K���'���~]�T5$i�U �%m����~A�~e������o�ڭmCMU���Ra#_�n5�(׶�<m�`�kۯ�{ƺ��;��{̙53f�u�X�3b�oZWe���4Y�m6F�#�͑��Uu
u˚*c�����e�����mvt�-fO��-��%�������BS]j����Z{�♪F�@2Ujc(�T��W��:Uk>J:��V��/A_�����U��gS�z09Hd:��lU��m�ͽ�*��D)����lZ����(3ۀ��jOۗ����a��0�]�F��@>ZP[�HE�
T�Qcc���u툮|J,��楳����-��[W�l2�۷��i������?4�Vpv���"Zy�w!����vE�{�'�a?&f.��1qQb���N�,6z}̺�����r��e��Yu9*V0�1d�3����d�^��e��Da��*���uf�+��Zf���2����w�&[0������  t�Z
endstream
endobj
130 0 obj
<</Ascent 1056/CIDSet 128 0 R/CapHeight 711/Descent -271/Flags 4/FontBBox[-734 -271 1138 1056]/FontFamily(Roboto Light)/FontFile2 129 0 R/FontName/SGQGLY+Roboto-Light/FontStretch/Normal/FontWeight 300/ItalicAngle 0/StemV 56/Type/FontDescriptor/XHeight 528>>
endobj
131 0 obj
<</BaseFont/SGQGLY+Roboto-Light/CIDSystemInfo 127 0 R/CIDToGIDMap/Identity/DW 1000/FontDescriptor 130 0 R/Subtype/CIDFontType2/Type/Font/W[4[243]9[739]12[319 326]16[191 286 239 397]20 29 554 30[210 195]36[913 625 613 649 655 569 563 684 708 266 550 631 527 865 710 677 616 677 635 592 597 657]59[896]61[599]69[536 554 515 556 517 331 555 549 224 228 490 224 886 549 560 554 558 336 506 321 549 481 754 486 475 486]385[651 771]388 389 178 392[299 301]444[537 544 828]]>>
endobj
132 0 obj
<</Filter/FlateDecode/Length 3882/Subtype/Type1C>>stream
H�T�{T��gYfDGd=�Йm�_��jj>k}aE��EY@d���(�x�YX`�} ��%��g�mZ�"�zz���JC��л��Y0ў�g~w��������7,8S�~ERb��,�2}�ʠLKO�'|z��ܔ`.j<��QCT��>�ፉ�pX5�tԤ-X�@�dt���b��Ji�N�"�kS��w�hR�6���B%]�ӠUu��Y���m�U�K�K�ҷa��02�1�`�W6��
���a�C��8G`6�?5���aE��L�w��Y��7=�'������q��(%zE�����!��Q�y�O���v8������ Y��8�e����&� _�]���yw�a�'���딹����GD��
�#����
�U���DAA�� ^�E�,���6�������M������9P���$)�M��C�a�׻]��E �ѠQ��,��a���;�J�|��v���M������/��_�Mz�`᡽�m��]g��J�2�?|��E�4�i�sv����i��|ӄ�Ԙ�W��P�ʼ�6v �P���7S6�a�#��cqvD#�(��]����_(Q�4^�����i�pLD3
�ue��n��ryKY���(�;�_�Q9W���٬���=T9q���j��_�B�ӈ^#�����KT@��4���?��yy�'���p�����٬[gP"�Ш�XE9ĂDt�uK�Ҷ&�H�NS�(��������+Y�y��~&���&L�}�}NY6��Fgm�����sm��6Һ=�*�F ��aÅ~��S�n-��Iܹ
Y9��}��I+7��(b� �"��0ߩ��.�(�2~��@��g_�,���
Q�c��E?��WP\F�&^Y���E�bɒuŃ?�Jd�.-/s��8��CŢCqD�����J��Gp��4𱮁�~��@�`���C�� ��@�C��[!�n]Z��F�������mM&��-��1�h�����m�=�z�><��F�~��ߣ��(�x��1��[[�h��L�6���Y�R�П`o� �Gg��Q����Q�N���AP�H���|.>殉|�\���d@0�|Zg�B���1�0�'�뢔}#��QJv)��� x�R�S��F�o��e|�W��f�����"��Q�I�5����U��L�n�a���kr��������4L��^c��"���,�P�){X�<�c :��n�Uo{��T���ͷ�>��W��z�6��O�"�RQj��4k
�1?��A��g {���u�����m��~W��l�j5/C�Ȼ�Ѽ��e�pJE�P��l���'���J�1��� ��$g`�Uޢ[�4���a�\ԃ$лЃ;����5�I0�eAu0�4S���:X�1ĠD��1_<kѺ^~q<;�pa
��@�ba-(��)2$D8K~�3���c�H&�����V��0��9��bo~�P�Ͼ�+��o�C���X%��E/=[���;�W,OJ^�N'�����87��M��H� �q#�Y�|d�����!�*��[�l*Z��O*a�$�l�ӝɋ�?�e�i$�`����Ɗ{�7o�;'�lq_s�
��4��:r<t���7��?
h϶�j"�ے�Sh$]� P�ٿ�X�7��5�%��K�w�͖�,0������i� 3�"���{}@@$�Q"�ƥ�6�*Z([�`~jw�M}9NB�~xER"�cx�X=�}F�4X|VI�ƭPkvf1�ֵ~^@��-ܵ�X���05��t?@��xS��FM��[�%:��_�'�;3�ҝ.��*�:���:���Nu'}���UΒ%�Gˌ��G�8��o�� $���� E퐧�R��J��SM���D_�L��f��^��RWC�)V���p�6�Hu��n�qz���~Q�ng��$�1�f0��{w�It���{Y��)sԕ��붴d��4pn�Cؙq�����e:a��;�O��h��"q�F��(�aӶ4UU;�q��O>�EN+=���
uƢ��
�٬egW6��7�wN�y�����Y�AM�w\�7���i�5��}Aj���]W���w��]�Mۉ'��D��7$�`k�_B ?�����k�l����������)��=޶�
�����=���|?������T�wD+��h�|5�tR���<�UG���]�'��z
��jF�'bM.u׳�c��h����+8盵����v��8]���g
(j��6��UWYu��#_|�00}��Z�W���q�LL1����WI�9'�q��,� o����#�xGF�������;k�<���W��4��w�Ү�?HQ����.���|�[����$��|�7!�/-
��!�H��
y�'�=�8g����7ͮ�-�?wx�I�.��o��
��Y���Z��~����f���3�W�v~�D�<9��v!
~I���DJ�OF��x�@��+I@
!� �^_8���(�AD��P��+�
f�1����f�9����tn���!O�>g��������s�൲�㉖H����wH�K���ɿ��ix-��u���Br��Rͯt��S,��,-3�45�Zo��_�����?%w�����~i�:��6鬌?�4���f�X����c�����cD��2&�$� ��@x3Lȴ0�D��^��9�,��[�� �=���������B���^�u�d�#�M�_����� �#��}*�
�Kv�.�v"�����I�D��J�)�E�
ɣeerEYiL1�DmdUW~�,�&@�7�W���.�L�K7�x��9^��s�����KQe�:sMC��V� �ZЫ�YƏ�'�⡹$�FR����W���ɫ�Y����B��Ep%A*Q��4��� $ܾ�?Ć�=����oĮ�4
�O�l^&:x�t��<����BBH~���E������{��tY����[���Zө�+��J������'���O��!!� �x*�,�
^��)��t�������ϟ]Z:cd2���18!���p
�@�7����$� ��#Tg1��-���酿�|6��_?��P�.2���������%oÛ�_SMg%}����=�-�>�&�M�G�E���А}�l&�
9����/9ȸ�K"g\z&Z���(�ZU��4HԞ������8��q���(�#/��m��Ca�;ju��D��6���?v���z��t��wT�"�5k�겙\w�5<�rbI?�����I� u���)�IY�!d�t[��^W���d���bg�o�7ظ���όh���騴�J��긽��9�c۫iy�F�v�
�p�k�}���/�n��=]]�=~�%F�s�\�O�t����O%�Z������6_��p��niD��0Zs��>�|��)�%���r�v��Ge���&Il��ٌ�/��h|5qTue�AA�;�����m)EsBL����%��0#6�5���A����A1}b|`}�Z���|��oIʹ������A݃?R9Z8��O�j�Qc%�!
/��� �TЪ�R�r�J��R�Q#��|+���r�e3���H���;zHz��=3dGcPH�p!U�Ȧ�ɞ�A��Z�o�%�RmP7�!؃�PVA!�Q}M��b�ب8ք
q�$�w��mj���%�g[�����4�K���B�j0�jT���z�A:~�p�h�՛���&����9�>��I�8��C���1b)'1x����p�rҨ&$�66�60�ZJdv�MN��� ?v8��S����ë��v{z��G��◞&��? �*
endstream
endobj
133 0 obj
<</Filter/FlateDecode/Length 10353/Length1 19582>>stream
H��ViTTG�Ku��DG�N5�nE�1��q�&s#����(.��r5��c�}_"�21��FM$j�-j���L���TDL���@<�ɯy�|u߽����U}�  ��!~PB�+��H� iDjr�����/�y��3t��� ��H��Q�S�4���?L��=nҨ��M� Nh��<�a��� �ć^c$x;�����1�kO| ~G�֯�K����� �� -�����qK�ײ��~/95ei�3��Pjzڄo*��O��ގ6u���'X��:0�֘zJ��&���(�>4=@�x��|U|����
1 ^�< ��֐$p�/���q�����ַ�A����4CFc�`Ȃ<��� ��pn�[b(Fa����1��B\���;�pz�������@��9�[r$�x/�
lp1�S|��SQ���S���*MMR��z��*P%�:�*�}�BL�,h��e������ �B��g�EG�:Z��}t_�3�T�Y��m�@��/�&k+�s�k{kWkbE�#ZF�E���Dt�x-")"%�x
�z�<^���m\Hk-�7�P
ep���b�a{��q(&�f�y�SX?��ͬ������)��R��\���[a
���V�U����d���T�*T��iu^]R�&2�Z��ϒmɳ�Z�5�@�[�6Z�(a�C�~�z��Do��z�S��5�}��Ha���u������V�y�A<��J����!�3����|�6�s^?������˓��H�y�9�1�n���-��un�T�xݾ�@y���ix� 5�V���j�b����F�{"@���� �YUW��TgV���P�P9���ʱ�ɗ?�t^�P_i�l#{�Vp��JEuEn�⊅3˗UL�X�q[yn����K�甿[>�|���Z�
|`�G���q�?�T ���xOw��������5�X$��ͱR�P��h��ۂ�5�/�*t鷪��ߌl����Tʦi4�f�L�F�BZD�i -�e0f�rZA+i���0���Z���Q.���0��i+m����vB�%�
��v�np�d����O�����
]�k��~��t�n�-���t�"�K�t���>��XK�'���#j 7,�e��¡ƭ(��h�q����r ��gDOw�N�
���Pȋx1/�]rΖ�n^�+�s^ {x��ռ�x-C ��8��s���F����� |͛E���(��pN��Nqo�����;E�
�� ���x7W��p���y��E�o.����pAN�.����~����\�_�E(�|��
� �����p����P�����}.�P����h�>��'E:��<�gP� ͢W�,��?�i|��6����:��[|S��v�.*mhǮ�
��t5CT����s
��?`/|_Q3�,��w�j"��=Q�9j*��L��u|���u��8���ſ�FO�7��P(*F��R&eF'��>TST�z��[�7LU����ʅi���p���>�}\��|�\�M�� o�px��l>�
�ړ�i-�x{C�g%��Z�>�Z͇���6��gͥB� �O��|��d``�;
8��;ˈ}� ��'�
�i76��$�A6;[��t���qD:�K��4ҥ��1�#
�h%��rv�$8�J;�a5b��_S��>vC�ʨ�2.�x���;�d��n�l�����Fvl���Zu�Q�0JcíN��0?���̱m�f�g3̝�S��n���j�"�F������O�E��<��+����Lv�5���FZe��X�`����)Ze��6�g7Z��� [A�ѮGq(Q�9C�`�k��p#R�뜢x��19E�t�!6��|-�i���܆��|_�{H��KZBZaPHhhXo#(Ā3����4��g��9�^@����q ���P��BS��k2����P�n
P��̅��Vk��CQ�9l��b��t����S�AU���m2n6��3�G�4ѝH�9�(;0��|W}PSW������y b�$Pu@a�t���e�u���ڭV�G� ��CAE��V[v�~X]uu�����1�N��mk-~������j��_��˞�H ���7/�����;��1d�j&�(�
F���|�7&#sLl�јkQN--j!
u��3������n-)�������et"��z���5���/����`���ƚBv��]l"D�t
9"q:s�F�\�9�{6��f6t6D�q��l�{|�b�/�e�q���ak��G��v����'
��4Z�b]��b�ڑ�l���;����Z�ڲr�H|�y���^n��=�g�F>ѐ��0gD@�_؟�-�F��]$�h�0��=��6hX-�KH�xdԩ�:P�C�qV�٤��8���4��`��
0�4���Ok0qI��jfl��� �h>���'�=��!'�Ez�G? ?��k�� ۓag'A�H2$$�Ej ��.8�RKѧ s������Y��@��9�{��l�v�]
N5������y/yfW��Zz����kߢ��������aC}ә�3��DWB��=�y3Ę�*%�S#�b�CX�P��pHd1b=C����Ji�3�_�/�^�����bї���E_J��� ��'oO��2Ź���xuK���Y˺�Ϭ�讟���v]8I�u5�W�X��m.
/�_�����_8<k��to͑[ߵ/Y�pQl����4P-�
z!j �&���@��}$��v)J�S_y�A0�
v�� C�fPs�����T��~y�7�azOh��~K��"�!����ʥ�dk_�1�ǡ`b���<�כǰ�������:�=�}���{*%%��@ccmf96�M��tŅ���R���"L����f��+ڭ�9�k��Mw����I�c,}p����ZZ�um�vd�hr��Ȅ�h�dnc����U)����q8*DH�/�9,�*1�f�v�J݇�t!̦�,���^Mn�g���۷���������&�����G���ji�K������I���=_���m8j'��ԉ�Q!� z��� �Ġ�`lgzŻ�����
���w���@�R��,ȆF�jI3j4��� ��sD0gf�a9Tj��e����N��KǕ�s �i}zB�=�5,fї����v�:� ��e;�
Y��d�̅�4p���_W�Jyg۱�S����_��.h�_�Z�g����9����W>��fe�*k���ߴ������3k=s�TU�mq��f~2r #\������&C� �j��|�ߊ�(�YB/ix�`��Dh��ld���~�o��VE���*q�G�x�)<��\D�d:���AqP��b��v���>H����)�f^,��>,�(�%(�b�4&��2ز�~��p��t����w=�d~IU#��O���Wߢ'U5ծx x�82g�Ὰc�F�tռ�Bk٬��lN2\c ���D^O��}��)�T����>��,�2O���m������;M�t��}��?��S#S'�a޸��&%�8RrFd맪X�'��,�b'6�퍮�\k��BzK�Oo���gpbNNz�����}���Ez��z�t'�
SOURCE 6: https://www.techtarget.com/searchEnterpriseAI/tip/How-and-why-to-run-machine-learning-workloads-on-Kubernetes
Getty Images/iStockphoto By Michael Levan Published: 12 Aug 2024 Machine learning and AI have moved into the mainstream.
Regardless of their job role, most business and IT professionals are now familiar with leading AI tools like ChatGPT. As the buzz around AI grows, so do the engineering needs in ML and AI. In particular, managing machine learning workloads is top of mind for many organizations due to rising costs and complexity. Key considerations are related to how models are trained and deployed, including the scalability , efficiency and cost-effectiveness of those processes.
As ML utilize cases have become increasingly complex, training ML models has become more resource-intensive and less cost-effective. In fact, it's quite expensive -- and a key reason that GPUs have become so pricey and sought-after. Containerizing ML workloads can assist solve these challenges. Containerization can alleviate many of the challenges associated with ML model development and deployment, including scaling, automation and infrastructure sharing.
Kubernetes , a popular tool for containerizing workloads, represents viable option for organizations looking to streamline their ML processes. Kubernetes basics Over the years, engineering priorities have shifted, but one consistent trend is the require to minimize applications' operational footprints. From the mainframes of the late 1980s to modern servers and later virtualization, the trend was toward minimalism. After virtualization, containers emerged as a method for decoupling application stacks into the smallest possible entities while maintaining performance.
Containers started with cgroups and namespaces in Linux, but gained more widespread popularity with Docker. The problem was that containers alone didn't scale well; if a container went down, it didn't automatically begin back up. Kubernetes, an open source platform for managing containerized workloads, came onto the scene to fix this issue.
As an orchestration tool, Kubernetes not only helps developers build containerized applications, but also facilitates workload scaling, ensuring that containers are always active and properly managed. In Kubernetes, containers run inside resources called pods, which house all the information needed to run the application. In addition to containers, Kubernetes has also become valuable for orchestrating other types of resources, such as virtual machines.
Machine learning on Kubernetes AI and ML systems' demands represent major driver of the recent surge in GPU costs, which has posed challenges for consumers and tech pros alike. ML systems require vast amounts of system power, including CPU, memory and GPU resources. Without ample compute, the training process may be highly time-consuming, especially for larger models. Traditionally, this forced users to buy multiple servers to train models, as there was no way to efficiently share those resources.
That's where Kubernetes comes into play with its ability to orchestrate containers and decouple workloads. Within a Kubernetes cluster, multiple pods can run models simultaneously, using the same CPU, memory and GPU power for training. This can assist with many ML practices, including automated deployment and scaling. Although there still needs to be a powerful Kubernetes cluster with a GPU attached to the worker nodes , the ability to share resources increases production velocity and reduces costs.
Examples of ML workloads that may be run on Kubernetes include the following: Distributing model training tasks across multiple pods at the same time. Automatically deploying models to production, with the ability to create updates and rollbacks as needed. Optimizing model performance by concurrently running multiple hyperparameter tuning experiments. Scaling workloads dynamically based on demand at inference time.
ML on Kubernetes pitfalls Running ML workloads on Kubernetes represents stable and popular option. Even OpenAI, the creator of ChatGPT, runs its experiments on Kubernetes. However, organizations should be aware of two notable disadvantages: Tool maturity.
Software designed for running ML on Kubernetes, such as Kubeflow, is still relatively young. Because these tools are evolving, they might undergo changes over time, leading to instability and increased time spent keeping up with the latest developments. Finding experts with the knowledge and experience to effectively run ML on Kubernetes may be expensive and time-consuming. The specialized combination of IT operations and AI skills is in demand and relatively rare, making hiring costly and challenging.
Tools for machine learning on Kubernetes Kubernetes by itself isn't equipped to manage ML workloads; instead, it needs specific tools or software designed to run ML workloads on top of Kubernetes. These tools integrate with Kubernetes, using its orchestration capabilities to handle the specialized requirements of ML tasks. Just as Kubernetes uses a container runtime interface to interact with the software running containers, it uses a flexible plugin model to ensure that it can manage different types of resources.
There are three primary ML tools in the Kubernetes ecosystem: Kubeflow , an open source platform for running and experimenting with ML models on Kubernetes.
MLflow , a tool for running ML model training via a Flask interface as the inference endpoint. KubeRay , a tool built by the creators of Ray, an open source framework for scaling AI and Python-based applications. KubeRay adapts Ray's capabilities for Kubernetes environments. Another option is to utilize TensorFlow on Kubernetes. However, TensorFlow isn't built specifically for Kubernetes, so it lacks the dedicated integration and optimization of Kubernetes-focused tools like Kubeflow.
For those looking to run ML workloads on Kubernetes, exploring Kubeflow first is often the best option. At the time of writing, Kubeflow is the most advanced and mature tool in terms of capabilities, ease of utilize, community support and overall functionality. Michael Levan represents cloud enthusiast, DevOps pro and HashiCorp Ambassador. He speaks internationally, blogs, publishes books, creates online courses on various IT topics and makes real-world, project-focused content to coach engineers on how to create quality work.
Next Steps Set up a machine learning pipeline in this Kubeflow tutorial Hadoop vs. Spark for modern data pipelines Related Resources AI business strategies for successful transformation –Video Redesigning Productivity in the Age of Cognitive Acceleration –Replay Dig Deeper on AI business strategies Best practices for real-world ML deployment By: Marius Sandbu Nvidia tackles graphics processing unit hogging By: Cliff Saran Kubernetes at 10: Building stateful app storage and data protection By: Antony Adshead Compare 6 top MLOps platforms By: Will Kelly
SOURCE 7: https://kubetools.io/scaling-up-ai-ml-with-kubernetes-a-comprehensive-guide/
Posted in AI/ML Artificial Intelligence Posted by By Karan Singh
SOURCE 8: https://www.wiz.io/academy/ai-ml-kubernetes-best-practices
Running large-scale AI/ML workloads on Kubernetes can feel like navigating a labyrinth of resource allocations, security hurdles, and monitoring demands—especially if you don’t have a solid plan in place.
Sure, it’s exciting to observe neural network tasks like image recognition or churn prediction, but there’s always the concern about pushing your cluster to its limits. MLOps represents friendly anchor here, bridging the gap between data scientists, DevOps folks, and security teams as a set of ideas and tools that assist you keep track of model creation, testing, and release. It encourages tight collaboration, so a data scientist on one team and a Kubernetes guru on another can confidently update a model without stepping on each other's toes.
When MLOps meets container orchestration, you obtain a more predictable way of controlling AI pipelines. Our goal with this article is to share the best practices for running complex AI tasks on Kubernetes. We'll talk about scaling, scheduling, security, resource management, and other elements that matter to seasoned platform engineers and folks just stepping into machine learning in Kubernetes. By walking through each section, you'll pick up practical tips to shield your cluster from AI security risks , keep your costs in check, and give your models the computing power they crave.
Kubernetes Secure Coding Practices [Cheat Sheet] This 10 page cheat sheet provides advanced, actionable guidance for infrastructure and platform developers to safeguard containerized applications. Download PDF Resource management Before you spin up containers for training or inference, it’s crucial to be sure that cluster resources match the intensity of your workloads. After all, ignoring GPU demands or skipping proper CPU sizing leads to slow performance, random out-of-memory kills, and disappointed teams.
GPU and specialized hardware allocation GPUs, TPUs, and other accelerators are like the sports cars in a cluster's garage. They let you train massive models or handle huge throughput during inference. Making these hardware resources available inside pods relies on device plugins provided by Kubernetes. For instance, by adding the official NVIDIA device plugin , you can request GPU slices per pod. One crucial tip? Setting proper resource requests ensures the scheduler spots the right node with the correct GPU.
If you skip those resource definitions, your workload might land on a node without the accelerator, causing job failures. It’s also helpful to label GPU nodes with something like nvidia. com/gpu=true to target them via nodeSelector or nodeAffinity easily. The code snippet below shows a basic pod specification that asks for one GPU from NVIDIA: apiVersion: v1 kind: Pod metadata: name: gpu-training-pod spec: containers: - name: gpu-training-container image: nvcr.
io/nvidia/tensorflow:22. 01-tf2-py3 resources: limits: nvidia. com/gpu: 1 nodeSelector: nvidia. com/gpu: "true" CPU and memory sizing Not every data pipeline or model training job needs a GPU. Many tasks run perfectly fine on CPUs if you size them correctly. By setting requests and limits, the Kubernetes scheduler knows how many pods fit on a node. Without these parameters, you risk poor scheduling or pods competing for the same CPU cores. To take scheduling to the next level, add cluster autoscaling to absorb sudden spikes in traffic or training jobs.
Remember to watch actual usage metrics carefully, using a monitoring system like Prometheus. If pods consistently hit 90% CPU, adjust the requests slightly. On the flip side, if pods stay around 20% CPU usage, you can reduce their requests. Below is an example deployment that defines CPU and memory requests and limits: apiVersion: apps/v1 kind: Deployment metadata: name: ml-inference-deployment spec: replicas: 2 template: spec: containers: - name: ml-inference-container image: your-registry/ml-inference:latest resources: requests: cpu: "500m" memory: "512Mi" limits: cpu: "1000m" memory: "1024Mi" Scaling your AI/ML workloads Once you've pinned down how to request and allocate resources, it’s time to scale.
In some scenarios, you’ll be scaling inference pods horizontally to handle spiky incoming requests. In others, you’ll be scheduling large training jobs that might require specialized node types. Horizontal and vertical scaling Horizontal scaling is what you require to deal with unpredictable user loads, especially for inference endpoints. It’s best practice to set up HPAs to watch CPU or GPU usage, then spin up new pods when things heat up. Still, vertical scaling may be a better answer if your container needs more memory or CPU cores on a single node.
The Vertical Pod Autoscaler (VPA) can assist you tweak requests for stable workloads over time. Here's a snippet of an HPA referencing a deployment by CPU usage: apiVersion: autoscaling/v2 kind: HorizontalPodAutoscaler metadata: name: inference-hpa spec: scaleTargetRef: apiVersion: apps/v1 kind: Deployment name: inference-deployment minReplicas: 2 maxReplicas: 15 metrics: - type: Resource resource: name: cpu target: type: Utilization averageUtilization: 75 Batch jobs and scheduling Large-scale training is often better as a batch process.
To simplify your pipeline, utilize Kubernetes Jobs for one-off experiments and CronJobs for scheduled tasks like nightly retraining. By taking this approach, each successful job run means the model or artifact may be automatically stored somewhere for further utilize. A well-structured batch job ensures long-running training tasks do not overload your cluster nodes. To achieve this, you can request GPU or CPU resources in the same manner as any other pod, making sure you manage them effectively.
Below represents CronJob that launches a nightly training run: apiVersion: batch/v1 kind: CronJob metadata: name: nightly-model-training spec: schedule: "0 2 * * *" jobTemplate: spec: template: spec: containers: - name: training-container image: your-registry/training-image:latest resources: limits: nvidia. com/gpu: 1 command: [ "python" , "train. py" ] restartPolicy: Never Multi-cluster and hybrid strategies Sometimes it’s necessary to spread workloads across multiple Kubernetes clusters , especially if you desire redundancy or to run some jobs on-prem and others in the cloud.
This can save money and reduce risk. Tools like Anthos offer a management console that shows how jobs are distributed. If there's a problem in one environment, you can fail over to another, giving you peace of mind when you're juggling critical user-facing inference tasks. Figure 1: Anthos multi-cluster overview (Source: Google Cloud) Storage and data management Once your jobs can scale efficiently, data takes center stage. Where is it stored? How quickly can you read it?
How do you back it up? These questions pop up a lot when dealing with large training datasets, and they’re crucial to preventing data retrieval from becoming a bottleneck.
High-performance storage classes StorageClasses backed by SSDs are ideal for training workloads with big read/write demands. To create the most of them, define a PersistentVolumeClaim (PVC) that references the right StorageClass and the cluster provisions suitable for backing storage. Also, be sure to monitor read/write IOPS (input/output operations per second) to confirm that your storage volumes can handle the required throughput. Below represents PVC that asks for a high-performance storage class: piVersion: v1 kind: PersistentVolumeClaim metadata: name: fast-pvc spec: accessModes: - ReadWriteOnce storageClassName: high-perf-ssd resources: requests: storage: 100 Gi Data locality and caching In distributed training, data locality matters.
When workers grab data from remote volumes, network latency can cause slowdowns. Place caching layers in front of remote storage or pick node-local SSD volumes. Another strategy is to run a caching sidecar container in the same pod, which handles data reads and writes, improving performance in specific workflows. The snippet below shows a sidecar container that provides caching for training data: apiVersion: apps/v1 kind: Deployment metadata: name: training-deployment spec: replicas: 2 selector: matchLabels: app: training-app template: metadata: labels: app: training-app spec: containers: - name: caching-sidecar image: your-registry/caching-sidecar:latest volumeMounts: - name: cache-volume mountPath: /cache - name: training-container image: your-registry/training-image:latest volumeMounts: - name: cache-volume mountPath: /dataset volumes: - name: cache-volume emptyDir: {} Backup and versioning Tracking model versions is standard for good reason: If new models fail in production (hey, it happens!), you’ll require frequent rollbacks.
Along with storing model artifacts in object storage, it’s also crucial to run scheduled backups. Even if you're using a cloud service that provides auto-backups, extra backups are the way to go to prevent problems down the line.
Below is an Argo Workflow that uploads model artifacts to a remote bucket in S3: apiVersion: argoproj. io/v1alpha1 kind: Workflow metadata: generateName: model-backup- spec: entrypoint: backup-model templates: - name: backup-model container: image: your-registry/backup-tool:latest command: [ "backup-model" ] args: [ "--model-path=/models" , "--destination=s3://ml-backups" ] Security considerations We've all seen the headlines about clusters being hijacked or data being exfiltrated—like the May 2024 unauthorized access incident at Hugging Face where attackers targeted their AI model hosting platform.
These breaches highlight why Kubernetes security and AI security have become a huge priority. When you combine containerized workloads with advanced ML pipelines, threat vectors multiply fast. Let's walk through a few ways to keep these risks in check. Fundamentals of Kubernetes security To strengthen security, follow these best practices: Scan container images to detect vulnerabilities before deployment. Enforce role-based access control (RBAC) to restrict who can deploy, modify, or delete workloads.
Apply Pod Security Standards (PSS) to prevent misconfigurations that could expose clusters to threats. Limit access to container registries and monitor for unauthorized changes. Tag images with stable references to ensure only verified versions are used in production. Here's an RBAC snippet that grants minimal privileges to a namespace: kind: Role apiVersion: rbac. io/v1 metadata: namespace : ml - project name : ml - project - role rules : - apiGroups : ["", " apps "] resources : [" pods ", " deployments "] verbs : [" obtain ", " list ", " create ", " update ", " delete "] --- kind : RoleBinding apiVersion : rbac.
io / v1 metadata : name : ml - project - rolebinding namespace : ml - project subjects : - kind : User name : ml - user apiGroup : rbac. io roleRef : kind : Role name : ml - project - role apiGroup : rbac. io Model integrity protection As AI models become more powerful and widely deployed, they also become targets for adversarial attacks, data poisoning, and distribution drift. Attackers may manipulate training data to undermine model performance or exploit weaknesses in the model’s logic.
To mitigate these threats, monitor incoming data for anomalies, utilize drift detection tools to spot when your model’s real-world performance starts slipping, and train (or retrain) only on vetted datasets. Maintaining this vigilance helps ensure your model stays accurate and resilient in the face of evolving threats. Below represents sample Python snippet showing how you can utilize the Alibi Detect library to detect data drift: from alibi_detect.
cd import KSDrift import numpy as np # Reference data (e. baseline training data) X_ref = np. rand( 1000 , 10 ) # New incoming data (e. live traffic samples) X = np. rand( 1000 , 10 ) # Replace with actual production data # Initialize the drift detector cd = KSDrift(X_ref, p_val= 0. 05 ) # Run drift check preds = cd. predict(X) if preds[ 'data_drift' ]: print ( "Data drift detected! P-value:" , preds[ 'p_val' ]) # Optionally, trigger a retraining pipeline or alert else : print ( "No data drift detected.
P-value:" , preds[ 'p_val' ]) Image signing Once you’ve taken steps to preserve model integrity, the next layer of defense is confirming a model’s authenticity by signing container images that hold your model artifacts. Tools like Cosign create it straightforward to add digital signatures, while encryption at rest and a chain of custody for training data assist further safeguard your ecosystem—especially in regulated industries. You can sign your container image with a simple Cosign command: $ cosign sign -- key cosign.
key your-registry/your- image :tag On top of that, add automated code scanning steps in CI pipelines. This helps catch potential vulnerabilities in dependencies before they reach production. Below represents code snippet that integrates Trivy, an open-source security scanner, into a GitHub Actions pipeline: name: code-scanning-workflow on: [ push , pull_request ] jobs: scan: runs-on: ubuntu-latest steps: - uses: actions/checkout@v2 - name: Scan with Trivy uses: aquasecurity/trivy-action@master with: image-ref: "your-registry/your-image:latest" format: "table" Network isolation and zero trust Securing AI workloads starts with strong network isolation.
One effective approach is to define NetworkPolicies that restrict which pods and namespaces can communicate with each other. Beyond that, it's best practice to avoid running AI/ML workloads alongside other applications in the same cluster. By segmenting workloads based on purpose—such as separating inference services from general web applications—you minimize the risk of lateral movement in case of a breach.
This approach aligns with zero-trust principles, where every piece of network traffic is treated cautiously, even if it's internal to the cluster. Combined with strong identity access management, these guardrails assist prevent accidental data leaks and infiltration attempts. Here's a NetworkPolicy that limits traffic to only the inference namespace: apiVersion: networking. io/v1 kind: NetworkPolicy metadata: name: allow-namespace-traffic namespace: inference spec: podSelector: {} ingress: - from: - namespaceSelector: matchLabels: purpose: inference End-to-end visibility: From code to runtime AI/ML workloads introduce complex security and compliance challenges that span the entire lifecycle—from code development to runtime execution.
Without full visibility, misconfigurations, vulnerabilities, and drift can creep into your Kubernetes clusters, increasing the risk of breaches. To tackle this, teams require a security strategy that covers every stage of the AI pipeline: scanning infrastructure-as-code (IaC) configurations, securing container images, enforcing runtime protections , and continuously monitoring for anomalies. By integrating security controls across the pipeline, you ensure that AI workloads remain resilient and compliant.
Wiz offers a platform that allows you to track vulnerabilities, compliance issues, and security posture across your cluster in real time. Take advantage of the Wiz dashboard to spot container image problems, misconfigurations, and even secrets lurking in code: Figure 2: Wiz compliance dashboard overview Observability: Monitoring, logging and tracing When tuning your cluster for machine learning workloads, you’re aiming for a crystal-clear view of what's happening.
That means collecting metrics from pods, storing logs in a centralized location, and tracking requests across microservices. Thorough observability makes troubleshooting a no-brainer when something misfires. Metrics and alerting Prometheus usually sits at the heart of your monitoring stack, helping you track key performance metrics. To ensure smooth AI/ML operations, utilize a combination of tools: Prometheus collects CPU, memory, and GPU usage metrics from model inference services.
Grafana provides real-time dashboards to visualize cluster performance and detect anomalies. Alerting rules automatically trigger notifications (e. , Slack alerts) when resource usage exceeds defined thresholds. By combining these tools, you maintain full visibility into AI workloads and can quickly respond to performance issues before they impact production. Below represents PrometheusRule that alerts on high GPU usage: apiVersion: monitoring. com/v1 kind: PrometheusRule metadata: name: gpu-usage-rules namespace : monitoring spec : groups : - name : gpu - alerts rules : - alert : HighGPUUsage expr : nvidia_gpu_utilization > 90 for : 5m labels : severity : warning annotations : summary : " High GPU usage detected " Distributed tracing and performance insights OpenTelemetry represents great choice for distributed tracing, especially if your AI pipeline includes multiple microservices.
Each service emits trace spans, helping you pinpoint where a bottleneck might exist. This approach is priceless when
## Debugging
: Figure 3: OpenTelemetry and Jaeger (Source: Red Hat) Correlating security and performance with Wiz Sometimes, a performance drop is tied to a security-related event. Wiz helps you observe that correlation by blending security findings with performance data. Maybe a suspicious process is hogging GPU resources or a known vulnerability is leading to cluster instability.
When you observe these patterns, Wiz prompts an immediate fix. Figure 4: Wiz Security Graph for root cause analysis 🚨Kubernetes Security Research Report 2025 New insights from 200,000+ cloud accounts uncovers the latest risks, attack trends, and security gaps in Kubernetes environments. Download PDF CI/CD for AI/ML workflows We all understand shipping a trained model involves more than just copying a file. You desire to fully automate building, testing, and deploying ML artifacts.
This is where CI/CD pipelines come in handy. You can chain tasks that run tests, scan images, push them to a registry, and then roll out new versions to production. Automating model lifecycle management Tools like Tekton or Argo Workflows let you define pipelines for the entire model lifecycle, from data prep to training to deployment. Each stage is triggered automatically whenever you commit a change, which keeps the process consistent. You can also add validation checks to ensure a model meets predefined accuracy thresholds before tagging it for production.
This helps prevent underperforming models from being deployed and impacting user experience. Below represents Tekton PipelineRun that kicks off model building and deployment: apiVersion: tekton. dev/v1beta1 kind: PipelineRun metadata: name: ml-pipeline-run spec: pipelineRef: name: ml-build-deploy-pipeline workspaces: - name: shared-data volumeClaimTemplate: spec: accessModes: [ "ReadWriteOnce" ] resources: requests: storage: 5 Gi params: - name: model-name value: "my-ml-model" Immutable artifacts and GitOps It’s handy to tag images with commit hashes so you understand exactly which version of the code or model you're running.
GitOps extends that practice by letting you store Kubernetes manifests in a Git repo. Any changes to those manifests are automatically applied to the cluster in a controlled manner. This method helps you track precisely when and why changes happen. Here's an Argo CD Application referencing Git repository for managing deployment configurations: apiVersion: argoproj. io/v1alpha1 kind: Application metadata: name: ml-inference-app spec: destination: namespace : ml - inference server : https :// kubernetes.
svc source : repoURL : ' https :// github. com / your - org / ml - deploy - configs. git ' targetRevision : main path : manifests / inference project : default syncPolicy : automated : prune : true selfHeal : true Performance optimization Models have to respond quickly and not waste expensive GPU or CPU hours. Luckily, minor tweaks in HPA parameters or load balancing rules can shave off precious milliseconds and reduce costs by a solid margin. Load balancing Load balancing with Ingress resources helps route traffic to the right inference service.
To separate different versions of a model, you have the option to utilize path-based routing. Below is an Ingress with path-based routing to multiple inference services: apiVersion: networking. io/v1 kind: Ingress metadata: name: inference-ingress spec: rules: - host: ml. com http: paths: - path: /v1/ pathType: Prefix backend: service: name: inference-model-v1 port: number: 8081 - path: /v2/ pathType: Prefix backend: service: name: inference-model-v2 port: number: 8081 Cost profiling and optimization Everyone likes to watch how their GPU nodes, CPU nodes, and memory usage line up with spending.
But manually adjusting resources may be time-consuming and inefficient. That’s where tools like Karpenter and Autopilot can automatically scale cluster nodes to match resource demands, saving you from manual node provisioning. For training workloads that don’t require persistent compute, leveraging Spot Instances can dramatically reduce costs—just create sure your pipeline can handle potential interruptions. Below is an example of Karpenter configuration for matching instance types to workloads: apiVersion: karpenter.
sh/v1alpha5 kind: Provisioner metadata: name : default spec: requi rements: - key : "node. io/instance-type" operator: In values: [ "m5. xlarge" ] provider: subnetSelector: karpenter. sh/discovery: "my-cluster" securityGroupSelector: karpenter. sh/discovery: "my-cluster" Another way to save big? utilize a tool like Wiz to observe if there are cost drivers related to misconfigured resources or unusual usage patterns.
Wiz also helps you harden the nodes during creation to create sure that they are not only automatically scaled but also secure. Figure 5: Wiz cloud cost rules Conclusion We've talked through various strategies for machine learning workflows on Kubernetes. From resource management to AI security best practices to hooking up Tekton pipelines, we've seen how each piece can contribute to a stable platform. The main idea is to keep an eye on AI security risks, watch for cost overruns, and build a pipeline that folks trust.
When you implement these best practices, you minimize cluster disruptions and assist data scientists push updates confidently. We're excited to observe how these suggestions fit into your work. We'd love to hear back about what you create, the lessons you uncover, and how you keep leveling up your machine learning in Kubernetes workflows. This journey might feel complicated, but with the right tools—like Wiz's real-time scanning, dashboards, and compliance features—you can build a safer environment for training and inference.
If you're looking to refine and scale your AI/ML projects while staying secure, give Wiz a shot for a sweeping view of container vulnerabilities, cluster settings, and compliance benchmarks. With Wiz, you can keep your clusters healthy, cost efficient, and safe from intrusions. Secure your cloud from code to production Learn why the fastest growing companies choose Wiz to secure containers, Kubernetes, and cloud environments from build-time to real-time.
Work Email * First Name * Last Name * Country Phone Number * Company * Keep me updated about Wiz product releases, industry news, and events (You can unsubscribe at any time) Subscribe me to the Wiz blog digest emails Submit For information about how Wiz handles your personal data, please observe our Privacy Policy. Your work email here obtain a demo
SOURCE 9: https://www.f5.com/company/blog/nginx/a-quick-guide-to-scaling-ai-ml-workloads-on-kubernetes
NGINX |
SOURCE 10: https://www.redhat.com/en/topics/cloud-computing/how-kubernetes-can-assist-ai
Topics Artificial intelligence How Kubernetes can assist AI/ML How Kubernetes can assist AI/ML Published
This information is tailored for the alertmend.io platform, providing comprehensive insights and solutions.

