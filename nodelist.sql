-- MySQL dump 10.13  Distrib 5.5.50, for debian-linux-gnu (armv7l)
--
-- Host: localhost    Database: iot
-- ------------------------------------------------------
-- Server version	5.5.50-0+deb8u1

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
  `mqttserver` varchar(200) DEFAULT 'mypi3',
  `mqttport` int(11) DEFAULT '1883',
  `mqttbase` varchar(32) DEFAULT 'home',
  `mqttpub` varchar(32) DEFAULT 'msg',
  `mqttsub` varchar(32) DEFAULT 'cmd',
  `iotserver` varchar(16) DEFAULT 'mypi3',
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `mac` (`mac`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-08-06 10:36:33
