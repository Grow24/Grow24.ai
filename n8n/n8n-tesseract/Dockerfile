FROM n8nio/n8n:latest

USER root

# Create a folder for community nodes
RUN mkdir -p /data/community_nodes

# Install the community node directly inside the correct folder
RUN npm install --prefix /data/community_nodes n8n-nodes-tesseractjs

# Set the correct environment variables so n8n picks it up
ENV N8N_CUSTOM_EXTENSIONS=/data/community_nodes
ENV N8N_COMMUNITY_PACKAGES_ENABLED=true

# Fix permissions
RUN chown -R node:node /data

USER node
