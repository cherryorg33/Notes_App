# Step 1: Build React frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY Note/ ./
RUN npm install && npm run build

# Step 2: Build Flask backend
FROM python:3.10-slim AS backend
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential default-libmysqlclient-dev gcc && rm -rf /var/lib/apt/lists/*

# Copy Flask backend
COPY Backend/ ./

# Copy frontend build
COPY --from=frontend /app/frontend/build ./frontend_build

# Create requirements.txt (if not present)
RUN echo "\
flask\n\
flask-cors\n\
flask-jwt-extended\n\
mysql-connector-python\n\
werkzeug\n" > requirements.txt

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
CMD ["python", "app.py"]
