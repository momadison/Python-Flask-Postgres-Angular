#Get base app
FROM python:3.7-buster as builder
#Set a working directory
WORKDIR '/usr/src/app'

#Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# install system dependencies
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends gcc

# lint
RUN pip install --upgrade pip
# RUN pip install flake8
COPY . /usr/src/app/
# RUN flake8 --ignore=E501,F401 .

#install python dependencies
COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt

FROM python:3.7-buster
#create directory for app user - not creating user can leave 
#root user exposed
# By default, Docker runs container processes as root inside of a container. 
# This is a bad practice since attackers can gain root access to the Docker 
# host if they manage to break out of the container. If you're root in the 
# container, you'll be root on the host.
RUN mkdir -p /home/app
#create app user
RUN useradd -ms /bin/bash app

#create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/api
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends netcat
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache /wheels/*

# copy entrypoint-prod.sh
COPY ./entrypoint.sh $APP_HOME

# copy project
COPY . $APP_HOME

# chown all the files to the app user
RUN chown -R app:app $APP_HOME

# change to the app user
USER app

# run entrypoint.prod.sh
ENTRYPOINT ["/home/app/api/entrypoint.sh"]