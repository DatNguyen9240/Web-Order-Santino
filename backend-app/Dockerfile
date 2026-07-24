FROM oven/bun:1

# Install Python 3 and pip
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Install python-docx inside the container
RUN pip3 install --no-cache-dir --break-system-packages python-docx

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies using Bun
RUN bun install

# Copy application code
COPY . .

# Expose port
EXPOSE 8081

# Run the server
CMD ["bun", "run", "server.js"]
