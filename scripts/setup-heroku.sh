#!/bin/bash
  git remote add heroku https://git.heroku.com/test-it-works.git
  wget https://cli-assets.heroku.com/branches/stable/heroku-linux-amd64.tar.gz
  sudo mkdir -p /usr/local/lib /usr/local/bin
  sudo tar -xvzf heroku-linux-amd64.tar.gz -C /usr/local/lib
  sudo ln -s /usr/local/lib/heroku/bin/heroku /usr/local/bin/heroku

  cat > ~/.netrc <<-EOF
  machine api.heroku.com
    login $HEROKU_LOGIN_2
    password $HEROKU_API_KEY_2
  machine git.heroku.com
    login $HEROKU_LOGIN_2
    password $HEROKU_API_KEY_2
EOF

# Add heroku.com to the list of known hosts
ssh-keyscan -H heroku.com >> ~/.ssh/known_hosts