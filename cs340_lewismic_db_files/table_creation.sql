/*
 * Drop statements to clean out any existing mst3k database records.
*/

DROP TABLE IF EXISTS `actor_character`;
DROP TABLE IF EXISTS `character_episode`;
DROP TABLE IF EXISTS `actor_episode`;
DROP TABLE IF EXISTS `episode`;
DROP TABLE IF EXISTS `actor`;
DROP TABLE IF EXISTS `mst3k_character`;
DROP TABLE IF EXISTS `movie`;
DROP TABLE IF EXISTS `genre`;

/*
 * mst3k.actor
 * Actors that have appeared in one or many Mystery Science Theater 3000 episodes.
*/

CREATE TABLE `actor` (
   `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
   `fname` VARCHAR(255) NOT NULL,
   `lname` VARCHAR(255),
   `wikia` VARCHAR(255),
   `imdb` VARCHAR(255)	
) ENGINE=’innoDB’;

/*
 * mst3k.mst3k_character
 * Character roles that have appeared in one or many Mystery Science Theater 3000 episodes.
*/

CREATE TABLE `mst3k_character` (
   `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
   `fname` VARCHAR(255) NOT NULL,
   `lname` VARCHAR(255),
   `type` VARCHAR(255) NOT NULL
) ENGINE=’innoDB’;

/*
 * mst3k.genre
 * Genre of the movie screened in a given episode.
*/

CREATE TABLE `genre` (
   `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
   `genre_name` VARCHAR(255) NOT NULL,
   `subgenre_name` VARCHAR(255)
) ENGINE=’innoDB’;

/*
 * mst3k.movie
 * Data for the movie screened in a given episode.
*/

CREATE TABLE `movie` (
   `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
   `title` VARCHAR(255) NOT NULL,
   `director_fname` VARCHAR(255),
   `director_lname` VARCHAR(255) NOT NULL,
   `year` INT(11),
   `synopsis` TEXT,
   `genre_id` INT(11),
   FOREIGN KEY(`genre_id`) REFERENCES genre(`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=’innoDB’;

/*
 * mst3k.episode
 * Mystery Science Theater 3000 episodes.
*/

CREATE TABLE `episode` (
   `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
   `title` VARCHAR(255) NOT NULL,
   `episode_number` INT(11) NOT NULL,
   `season_number` INT(11) NOT NULL,
   `release_date` DATE,
   `movie_id` INT(11),
   FOREIGN KEY(`movie_id`) REFERENCES movie(`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=’innoDB’;

/*
 * mst3k.actor_episode
 * This table relates actors to the Mystery Science Theater 3000 episodes
 * they have acted in. This is a many to many relationship (actor, episode).
*/

CREATE TABLE `actor_episode` (
   `actor_id` INT(11),
   `episode_id` INT(11),
   PRIMARY KEY (`actor_id`, `episode_id`),
   FOREIGN KEY (`actor_id`) REFERENCES actor(`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   FOREIGN KEY (`episode_id`) REFERENCES episode(`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=’innoDB’;

/*
 * mst3k.actor_character
 * This table relates actors to the characters they have played
 * in Mystery Science Theater 3000 episodes. This is a many to many
 * relationship, as some characters have been played or voiced by
 * multiple actors throughout the series, while actors have played or
 * voiced multiple characters (actor, character).
*/

CREATE TABLE `actor_character` (
   `actor_id` INT(11),
   `character_id` INT(11),
   PRIMARY KEY (`actor_id`, `character_id`),
   FOREIGN KEY (`actor_id`) REFERENCES actor(`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   FOREIGN KEY (`character_id`) REFERENCES mst3k_character(`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=’innoDB’;

/*
 * mst3k.character_episode
 * This table relates Mystery Science Theater 3000 characters to
 * episodes from the database that they have appeared in. This is a
 * many to many relationship (character, episode).
*/

CREATE TABLE `character_episode` (
   `character_id` INT(11),
   `episode_id` INT(11),
   PRIMARY KEY (`character_id`, `episode_id`),
   FOREIGN KEY (`character_id`) REFERENCES mst3k_character(`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   FOREIGN KEY (`episode_id`) REFERENCES episode(`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=’innoDB’;
