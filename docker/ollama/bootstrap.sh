#!/bin/bash

echo "Bootstrapping Ollama..."

ollama serve &
OLLAMA_PID=$!

until curl -s http://localhost:11434; do
  echo "Waiting for Ollama..."
  sleep 2
done

echo "Ollama is ready, pulling model..."
ollama pull llama3

kill $OLLAMA_PID

echo "Model pulled. Starting Ollama..."
exec ollama serve