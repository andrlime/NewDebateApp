### 
### Dockerfile for Debate App Backend Unless you know what you are doing,
### please use the PRE-BUILT Docker container andrewli2048/backend-debate. Otherwise,
### unless your server is non Intel, you MUST compile on Intel, or use buildx.
###

# Pass the port you are using to the Docker build process
ARG PORT=3030

# Use rust container to build
FROM rust:1.68 AS builder

# Set working directory and copy src files + package manifest
WORKDIR /usr/src/app
COPY ./Cargo.toml ./Cargo.toml
COPY ./src ./src

# Build the package with optimizations
RUN cargo build --release

# Create the actual image using UBUNTU, which includes needed C libraries to run the binary
FROM ubuntu:lunar

# Copy the binary and run it
COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin
CMD ["backend"]

# Expose port
EXPOSE $PORT