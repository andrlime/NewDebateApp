FROM rust:1.68 AS builder

WORKDIR /usr/src/app

# Cache dependencies
COPY ./Cargo.toml ./Cargo.toml

RUN mkdir src/ && echo "fn main() {println!(\"if you see this, the build broke\")}" > src/main.rs && \
    cargo build --release && rm -rf src/

COPY ./src ./src

RUN cargo build --release

# creates actual image
FROM debian:buster-slim

COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin
COPY .env .env

CMD ["/usr/local/bin/backend"]

EXPOSE 3030
