#!/bin/bash

echo "Stopping containers on EC2..."
ssh solidity-visualizer 'cd /home/ec2-user/solidity-visualizer && sudo docker-compose down'

echo "Copying backend files to EC2..."
scp -r backend/* solidity-visualizer:/home/ec2-user/solidity-visualizer/backend/

echo "Rebuilding and starting containers on EC2..."
ssh solidity-visualizer 'cd /home/ec2-user/solidity-visualizer && sudo docker-compose up --build -d'

echo "Showing logs..."
ssh solidity-visualizer 'cd /home/ec2-user/solidity-visualizer && sudo docker-compose logs -f api' 