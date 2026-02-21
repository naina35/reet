CREATE DATABASE HEER;
USE HEER;
create table USERS(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username varchar(30) NOT NULL UNIQUE,
    PASSWORD CHAR(64) NOT NULL ,
    bio varchar(100) ,
    pfp varchar(255)
);
create table refs_user(
	id INT PRIMARY KEY AUTO_INCREMENT,
	user_id INT NOT NULL,
	token varchar(255),
    created_at datetime,
    expires_at datetime,
    revoked boolean,
    foreign key (user_id) references users(id)
);
ALTER TABLE refs_user
MODIFY COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE refs_user
MODIFY COLUMN revoked boolean NOT NULL DEFAULT true;
ALTER table users
add column email  varchar(255);
insert into users (username,password,bio) 
	values ("Prabh","akdhfkjasdkfjnsadfsk","Hi there im prabh");
create table POSTS(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT not null,
	pic varchar(255),
    caption text,
    FOREIGN KEY (user_id) REFERENCES USERS(id)
);
create table rels(
	user1 int PRIMARY KEY ,
    user2 int NOT NULL ,
    type enum('follow','block') ,
    foreign key (USER1) references USERS(id) ,
    foreign key (USER2) references USERS(id)
);
drop table rels ;
create table rels(
    id int primary key,
    user1 int NOT NULL ,
    user2 int NOT NULL ,
    type enum('follow','pending') ,
    foreign key (USER1) references USERS(id) ,
    foreign key (USER2) references USERS(id),
    constraint unique_cons unique(user1,user2)
);

drop database heer;
ALTER TABLE posts
DROP FOREIGN KEY user_id;

ALTER TABLE posts 
  ADD CONSTRAINT user_id_cascade 
  FOREIGN KEY (user_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;
