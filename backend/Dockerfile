# Use rust container to build
FROM rust:1.68 AS builder

WORKDIR /usr/src/app
COPY ./Cargo.toml ./Cargo.lock ./
COPY ./src ./src

# Build the package with optimizations
RUN cargo build --release

# Create the actual image using UBUNTU, which includes needed C libraries to run the binary
FROM ubuntu:lunar

# Copy the binary and run it
COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin
CMD ["backend"]

# Expose port
EXPOSE 3030
