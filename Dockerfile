FROM node:998-alpine

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code only (not everything)
COPY src/ ./src/

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Switch to non-root user
USER appuser

EXPOSE 3000

CMD ["node", "src/index.js"]