aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 629911049680.dkr.ecr.us-east-1.amazonaws.com
docker build -t clothoak-api .
docker tag clothoak-api:latest 629911049680.dkr.ecr.us-east-1.amazonaws.com/clothoak:latest
docker push 629911049680.dkr.ecr.us-east-1.amazonaws.com/clothoak:latest