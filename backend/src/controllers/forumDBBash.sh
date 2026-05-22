#!/bin/bash

BASE_URL="http://localhost:3500"
echo "Enter your MongoDB id: "
read USER_ID
echo "Hello $USER_ID"
echo ""

echo "Creating a question"
QUESTION_RES=$(curl -s -X POST $BASE_URL/api/forum/questions \
  -H "Content-Type: application/json" \
  -d "{\"questionTitle\":\"How to prep for SWE interviews?\",\"questionContent\":\"Looking for advice on leetcode vs system design focus.\",\"userId\":\"$USER_ID\"}")
echo $QUESTION_RES | python3 -m json.tool
QUESTION_ID=$(echo $QUESTION_RES | python3 -c "import sys,json; print(json.load(sys.stdin)['_id'])")
echo "Question created with ID: $QUESTION_ID"

echo ""
echo "Fetching all questions"
curl -s $BASE_URL/api/forum/questions | python3 -m json.tool

echo ""
echo "Fetching question $QUESTION_ID (answers should be empty)"
curl -s $BASE_URL/api/forum/questions/$QUESTION_ID | python3 -m json.tool

echo ""
echo "Adding first answer to question $QUESTION_ID"
ANSWER1_RES=$(curl -s -X POST $BASE_URL/api/forum/questions/$QUESTION_ID/answers \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_ID\",\"answerContent\":\"Focus on LC mediums first, then system design after 100 problems.\"}")
echo $ANSWER1_RES | python3 -m json.tool
ANSWER1_ID=$(echo $ANSWER1_RES | python3 -c "import sys,json; print(json.load(sys.stdin)['_id'])")
echo "Answer 1 created with ID: $ANSWER1_ID"

echo ""
echo "Adding second answer from a different user"
ANSWER2_RES=$(curl -s -X POST $BASE_URL/api/forum/questions/$QUESTION_ID/answers \
  -H "Content-Type: application/json" \
  -d '{"userId":"anotherFirebaseUID123","answerContent":"I would prioritize behavioral prep early, companies care a lot about it."}')
echo $ANSWER2_RES | python3 -m json.tool
ANSWER2_ID=$(echo $ANSWER2_RES | python3 -c "import sys,json; print(json.load(sys.stdin)['_id'])")
echo "Answer 2 created with ID: $ANSWER2_ID"

echo ""
echo "Fetching question $QUESTION_ID (answers array should have 2 IDs)"
curl -s $BASE_URL/api/forum/questions/$QUESTION_ID | python3 -m json.tool

echo ""
echo "Reacting 👍 to answer $ANSWER1_ID"
curl -s -X PATCH $BASE_URL/api/forum/answers/$ANSWER1_ID/reactions \
  -H "Content-Type: application/json" \
  -d '{"emoji":"👍","delta":1}' | python3 -m json.tool

echo ""
echo "Reacting 🔥 to answer $ANSWER1_ID"
curl -s -X PATCH $BASE_URL/api/forum/answers/$ANSWER1_ID/reactions \
  -H "Content-Type: application/json" \
  -d '{"emoji":"🔥","delta":1}' | python3 -m json.tool

echo ""
echo "Removing 👍 from answer $ANSWER1_ID (count should go back to 0)"
curl -s -X PATCH $BASE_URL/api/forum/answers/$ANSWER1_ID/reactions \
  -H "Content-Type: application/json" \
  -d '{"emoji":"👍","delta":-1}' | python3 -m json.tool

echo ""
echo "Updating question title"
curl -s -X PATCH $BASE_URL/api/forum/questions/$QUESTION_ID \
  -H "Content-Type: application/json" \
  -d '{"questionTitle":"How to prep for SWE interviews at big tech?"}' | python3 -m json.tool
echo "Check that modifiedDate changed but createdDate stayed the same"

echo ""
echo "Deleting answer $ANSWER2_ID"
curl -s -X DELETE $BASE_URL/api/forum/answers/$ANSWER2_ID
curl -s $BASE_URL/api/forum/questions/$QUESTION_ID | python3 -m json.tool