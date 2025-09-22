#!/bin/bash

# Check if a URL parameter was provided
if [ -z "$1" ]; then
  echo "No URL provided"
  exit 1
fi



URL="$1"
FAILS=0

echo "** Test 1: Correct login **"
response=$(curl -s -X POST $URL \
-H "Content-Type: application/json" \
-d "${{ secrets.MONGO_TEST_USER }}")

# check if response is valid JSON:
if echo "$response" | jq empty 2>/dev/null; then
  token=$(echo "$response" | jq -r ".token")
  if [ "$token" != "null" ] && [ -n "$token" ]; then
    echo "Ok: User successfully logged-in"
  else
    # get only the error message from the response
    error_msg=$(echo "$response" | jq -r '.message // empty')
    if [ -n "$error_msg" ]; then
      echo "Fail: $error_msg"
      FAIL=$((FAIL + 1))
    else
      echo "Fail: unexpected response"
      FAIL=$((FAIL + 1))
    fi
  fi
else
  # response is not JSON
  echo "Fail: $response"
  FAIL=$((FAIL + 1))
fi


echo "** Test 2: Wrong login **"
response=$(curl -s -X POST $URL \
-H "Content-Type: application/json" \
-d '{"email": "wrong@gmail.com", "password": "Abc@12345"}')

# check if response is valid JSON:
if echo "$response" | jq empty 2>/dev/null; then
  token=$(echo "$response" | jq -r ".token")
  if [ "$token" != "null" ] && [ -n "$token" ]; then
    echo "Fail: Wrong login have a token"
    FAIL=$((FAIL + 1))
  else
    # get only the error message from the response
    error_msg=$(echo "$response" | jq -r '.message // empty')
    if [ -n "$error_msg" ]; then
      echo "Ok: $error_msg"
    else
      echo "Ok: unexpected response"
    fi
  fi
else
  # response is not JSON
  echo "Ok: $response"
fi


echo "** Test 3: Wrong Password **"
response=$(curl -s -X POST $URL \
-H "Content-Type: application/json" \
-d '{"email": "nir@gmail.com", "password": "Abc@12345"}')

# check if response is valid JSON
if echo "$response" | jq empty 2>/dev/null; then
  token=$(echo "$response" | jq -r ".token")
  if [ "$token" != "null" ] && [ -n "$token" ]; then
    echo "Fail: Wrong password have a token"
    FAIL=$((FAIL + 1))
  else
    #  get only the error message from the response
    error_msg=$(echo "$response" | jq -r ".message // empty")
    if [ -n "$error_msg" ]; then
      echo "Ok: $error_msg"
    else
      echo "Ok: unexpected response"
    fi
  fi
else
  # response is not JSON
  echo "Ok: $response"
fi

# Exit with failure if any test failed
if [ "$FAIL" -ge 1 ]; then
  exit 1
else
  exit 0
fi




