FROM node:20-bullseye-slim

# Install Python 3 and requests library required for the scanning engine
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*
# In Debian/Ubuntu, externally managed environments require BREAK_SYSTEM_PACKAGES or venv.
# For a raw docker container, we can bypass it or use pip3 install --break-system-packages
RUN pip3 install requests --no-cache-dir --break-system-packages || pip3 install requests --no-cache-dir

WORKDIR /app

# Install Node.js dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma Client for SQLite
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "start"]
