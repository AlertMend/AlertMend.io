# 1. Use official Node.js base image
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the app
COPY . .

# 6. Expose port (Vite usually uses 5173, change if needed)
EXPOSE 3000

# 7. Start the dev server
CMD ["npm", "run", "dev"]
