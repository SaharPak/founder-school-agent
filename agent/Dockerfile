# Container image for the Founder School Companion agent.
# Works on any Docker host. Tuned for Hugging Face Spaces, which expect the app
# to listen on port 7860. See ../DEPLOYMENT.md for full instructions.

FROM node:20-slim

WORKDIR /app

# Install dependencies first for better layer caching.
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the app.
COPY . .

# Hugging Face Spaces route traffic to port 7860.
ENV PORT=7860
EXPOSE 7860

CMD ["npm", "start"]
