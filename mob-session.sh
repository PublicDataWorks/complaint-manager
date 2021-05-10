#!/bin/bash

set -e

start() {
  git fetch origin master
  git checkout master
  git merge origin/master --ff-only
  git checkout -b $BRANCHNAME
  git push --set-upstream origin $BRANCHNAME --no-verify
  echo "session $BRANCHNAME started"
}

pass() {
  git fetch origin master
  git add -N .
  git add -p
  git commit -m "WIP - Pass to next" --allow-empty
  git push origin $BRANCHNAME --no-verify
  git checkout master
  git branch -D $BRANCHNAME
  echo "session $BRANCHNAME passed"
}

receive() {
  git checkout master
  if git show-ref --quiet refs/heads/$BRANCHNAME; then
    echo "branch $BRANCHNAME already exists and will be deleted"
    git branch -D $BRANCHNAME
  else
    echo "branch $BRANCHNAME does not exist"
  fi
  git fetch origin $BRANCHNAME
  git checkout --track origin/$BRANCHNAME
  echo "session $BRANCHNAME received"
}

finish() {
  git add -N .
  git add -p
  git commit -m "WIP - Finish" --allow-empty
  git fetch origin master
  git checkout master
  git merge origin/master --ff-only
  git merge --squash --ff $BRANCHNAME
  git branch -D $BRANCHNAME
  git push origin --delete $BRANCHNAME --no-verify
  echo "session $BRANCHNAME finished"
}

usage() {
  echo "Usage:"
  echo ""
  echo "mob-session.sh <option> [branchname]"
  echo ""
  echo "Where <option> is one of:"
  echo "--start   : To start a mob session"
  echo "--receive : To receive the handover branch"
  echo "--pass   : To push the handover branch"
  echo "--finish : To finish the mob session"
  echo ""
  echo "Where [branch] can optionally be specified to use your own handover branch name.  Default handover branch name is mob-session"
}

if [[ $# -gt 2 ]]; then
  usage
  exit 2
fi

while test $# -gt 0
do
    case "$1" in
        --start) COMMAND=start
            ;;
        --pass) COMMAND=pass
            ;;
        --receive) COMMAND=receive
                ;;
        --finish) COMMAND=finish
                    ;;
        --*) COMMAND=usage
            ;;
        *) BRANCNAMEARG=$1
            ;;
    esac
    shift
done

if [[ -z "$COMMAND" ]]; then
  usage
  exit 2
fi

if [[ -z $BRANCNAMEARG ]]; then
  BRANCHNAME="mob-session"
else
  BRANCHNAME=$BRANCNAMEARG
fi

"$COMMAND"
