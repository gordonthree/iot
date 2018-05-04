-- MySQL dump 10.13  Distrib 5.5.60, for debian-linux-gnu (armv8l)
--
-- Host: localhost    Database: iot
-- ------------------------------------------------------
-- Server version	5.5.60-0+deb8u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `iot`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `iot` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `iot`;

--
-- Table structure for table `amps`
--

DROP TABLE IF EXISTS `amps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `amps` (
  `id` mediumint(9) unsigned NOT NULL AUTO_INCREMENT,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `nodename` varchar(32) NOT NULL,
  `sensor` varchar(16) NOT NULL,
  `value` decimal(6,3) DEFAULT '0.000',
  PRIMARY KEY (`id`),
  KEY `nodename` (`nodename`),
  KEY `sensor` (`sensor`),
  KEY `value` (`value`)
) ENGINE=InnoDB AUTO_INCREMENT=16777215 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `current_temps`
--

DROP TABLE IF EXISTS `current_temps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `current_temps` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `nodename` varchar(100) NOT NULL,
  `temperature` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nodename` (`nodename`)
) ENGINE=InnoDB AUTO_INCREMENT=4250179 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `node_updates`
--

DROP TABLE IF EXISTS `node_updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `node_updates` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `nodename` varchar(32) NOT NULL,
  `hasupdate` tinyint(1) NOT NULL DEFAULT '0',
  `updated` tinyint(1) NOT NULL DEFAULT '0',
  `url` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nodename` (`nodename`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nodelist`
--

DROP TABLE IF EXISTS `nodelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nodelist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mac` varchar(12) NOT NULL,
  `nodename` varchar(32) NOT NULL,
  `fwpath` varchar(200) DEFAULT '/home/pi/fw/autoconf_1m.bin',
  `spiffspath` varchar(200) DEFAULT NULL,
  `lastseen` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatets` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `cfgversion` int(11) DEFAULT '1000',
  `fwversion` int(11) DEFAULT '1000',
  `fsversion` int(11) DEFAULT '1000',
  `mqttserver` varchar(200) NOT NULL DEFAULT '192.168.2.30',
  `mqttport` int(11) DEFAULT '1883',
  `mqttbase` varchar(32) DEFAULT 'home',
  `mqttpub` varchar(32) DEFAULT 'msg',
  `mqttsub` varchar(32) DEFAULT 'cmd',
  `iotserver` varchar(200) NOT NULL DEFAULT '192.168.2.30',
  `iotport` varchar(6) DEFAULT '3000',
  `iotcfgurl` varchar(100) DEFAULT 'iotconfig',
  `iotfwurl` varchar(100) DEFAULT 'iotfw',
  `ipaddr` varchar(16) DEFAULT NULL,
  `subnet` varchar(16) DEFAULT NULL,
  `dns1` varchar(16) DEFAULT NULL,
  `ntpserver` varchar(200) DEFAULT 'us.pool.ntp.org',
  `role` varchar(200) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `notes` varchar(200) DEFAULT NULL,
  `sleepenable` tinyint(1) DEFAULT '0',
  `sleepperiod` int(11) DEFAULT '900',
  `advcfg` tinyint(1) DEFAULT '0',
  `advcfgkey` varchar(32) DEFAULT NULL,
  `usegetvcc` tinyint(1) DEFAULT '0',
  `vccoffset` smallint(6) DEFAULT '0',
  `vccdivsor` varchar(8) DEFAULT '5.545',
  `hastout` tinyint(1) DEFAULT '0',
  `owpwr` smallint(6) DEFAULT '1',
  `owdat` smallint(6) DEFAULT '13',
  `hastpwr` tinyint(4) DEFAULT '0',
  `hasiout` tinyint(1) DEFAULT '0',
  `hasi2cpwr` tinyint(1) DEFAULT '0',
  `hasspeed` tinyint(1) DEFAULT '0',
  `hasi2c` tinyint(1) DEFAULT '0',
  `iotsda` tinyint(4) DEFAULT '12',
  `iotscl` tinyint(4) DEFAULT '14',
  `rawadc` tinyint(1) DEFAULT '0',
  `ntpoffset` tinyint(4) DEFAULT '4',
  `hasvout` tinyint(1) DEFAULT '0',
  `hasrssi` tinyint(1) DEFAULT '0',
  `haststat` tinyint(1) DEFAULT '0',
  `sw1en` tinyint(1) DEFAULT '-1',
  `sw2en` tinyint(1) DEFAULT '-1',
  `sw3en` tinyint(1) DEFAULT '-1',
  `sw4en` tinyint(1) DEFAULT '-1',
  `sw1pin` tinyint(4) DEFAULT '-1',
  `sw2pin` tinyint(4) DEFAULT '-1',
  `sw3pin` tinyint(4) DEFAULT '-1',
  `sw4pin` tinyint(4) DEFAULT '-1',
  `sw1label` varchar(32) DEFAULT 'Switch One',
  `sw2label` varchar(32) DEFAULT 'Switch Two',
  `sw3label` varchar(32) DEFAULT 'Switch Three',
  `sw4label` varchar(32) DEFAULT 'Switch Four',
  `acsoffset` smallint(6) DEFAULT '1641',
  `updaterate` smallint(6) DEFAULT '50',
  `currentip` varchar(20) DEFAULT '0.0.0.0',
  `flashmb` tinyint(4) DEFAULT '1',
  `altadcvbat` tinyint(1) DEFAULT '0',
  `mvpera` varchar(8) NOT NULL DEFAULT '44.0',
  `sw1type` tinyint(4) DEFAULT '0',
  `sw2type` tinyint(4) DEFAULT '0',
  `sw3type` tinyint(4) DEFAULT '0',
  `sw4type` tinyint(4) DEFAULT '0',
  `hasrgb` tinyint(1) DEFAULT '0',
  `hasfan` tinyint(1) DEFAULT '0',
  `timeOut` tinyint(1) DEFAULT '0',
  `rgbwchan` tinyint(1) DEFAULT '57',
  `hasadc` tinyint(1) DEFAULT '0',
  `tstatmode` tinyint(1) DEFAULT '-1',
  `tstatset` tinyint(1) DEFAULT '21',
  PRIMARY KEY (`id`),
  UNIQUE KEY `mac` (`mac`)
) ENGINE=InnoDB AUTO_INCREMENT=5498 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nodes`
--

DROP TABLE IF EXISTS `nodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nodes` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nodename` varchar(100) NOT NULL,
  `lastseen` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `topic` varchar(100) DEFAULT NULL,
  `payload` varchar(1023) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nodename` (`nodename`)
) ENGINE=InnoDB AUTO_INCREMENT=8388607 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rssi`
--

DROP TABLE IF EXISTS `rssi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rssi` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `nodename` varchar(32) NOT NULL,
  `rssi` varchar(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `topic` (`nodename`)
) ENGINE=InnoDB AUTO_INCREMENT=7218057 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rssi_history`
--

DROP TABLE IF EXISTS `rssi_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rssi_history` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `nodename` varchar(32) NOT NULL,
  `rssi` varchar(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `rssi` (`rssi`)
) ENGINE=InnoDB AUTO_INCREMENT=8388607 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `temps`
--

DROP TABLE IF EXISTS `temps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temps` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `topic` varchar(100) NOT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `temp` varchar(10) DEFAULT '-127.0',
  PRIMARY KEY (`id`),
  KEY `temp` (`temp`),
  KEY `topic` (`topic`),
  KEY `ts` (`ts`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vbat`
--

DROP TABLE IF EXISTS `vbat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vbat` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `topic` varchar(100) NOT NULL,
  `battery` varchar(8) DEFAULT NULL,
  `notified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `topic` (`topic`)
) ENGINE=InnoDB AUTO_INCREMENT=1749083 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vbat_history`
--

DROP TABLE IF EXISTS `vbat_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vbat_history` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `nodename` varchar(100) NOT NULL,
  `battery` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `battery` (`battery`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-04 10:03:19
