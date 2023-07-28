FROM rust:1.67
WORKDIR /usr/src/backend
COPY . .

RUN cargo build --release
CMD ["./target/release/backend"]
