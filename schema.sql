
SET default_tablespace = '';

SET default_table_access_method = heap;


CREATE TABLE dislikes (
    user_id integer NOT NULL,
    comment_id integer,
    post_id integer
);


ALTER TABLE dislikes OWNER TO postgres;



CREATE TABLE likes (
    user_id integer NOT NULL,
    comment_id integer,
    post_id integer
);


ALTER TABLE likes OWNER TO postgres;


CREATE TABLE posts (
    post_title character varying,
    post_description character varying NOT NULL,
    post_img character varying,
    post_lat character varying,
    post_lng character varying,
    user_id character varying NOT NULL,
    post_id integer NOT NULL,
    post_date timestamp without time zone
);


ALTER TABLE posts OWNER TO postgres;



CREATE SEQUENCE "posts_post_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "posts_post_Id_seq" OWNER TO postgres;



ALTER SEQUENCE "posts_post_Id_seq" OWNED BY posts.post_id;




CREATE TABLE users (
    user_id integer NOT NULL,
    user_name character varying NOT NULL,
    user_email character varying NOT NULL,
    user_password character varying,
    date date DEFAULT CURRENT_DATE NOT NULL,
    user_phone character varying DEFAULT ''::character varying NOT NULL,
    user_img character varying DEFAULT 'user.png'::character varying,
    user_description character varying DEFAULT ''::character varying NOT NULL,
    status character varying DEFAULT 'not_activated'::character varying NOT NULL,
    activated_token character varying DEFAULT '""'::character varying NOT NULL,
    resetpassword_token character varying DEFAULT '""'::character varying NOT NULL,
    google_id character varying,
    changed_photo character varying,
    user_rank character varying DEFAULT 'bronze'::character varying NOT NULL
);


ALTER TABLE users OWNER TO postgres;

CREATE SEQUENCE users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_user_id_seq OWNER TO postgres;



ALTER SEQUENCE users_user_id_seq OWNED BY users.user_id;



ALTER TABLE ONLY posts ALTER COLUMN post_id SET DEFAULT nextval('"posts_post_Id_seq"'::regclass);




ALTER TABLE ONLY users ALTER COLUMN user_id SET DEFAULT nextval('users_user_id_seq'::regclass);




ALTER TABLE ONLY posts
    ADD CONSTRAINT "unique_posts_post_Id" UNIQUE (post_id);




ALTER TABLE ONLY users
    ADD CONSTRAINT unique_users_google_id UNIQUE (google_id);




ALTER TABLE ONLY users
    ADD CONSTRAINT unique_users_user_email UNIQUE (user_email);



ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);



CREATE INDEX index_user_name ON users USING btree (user_name);

