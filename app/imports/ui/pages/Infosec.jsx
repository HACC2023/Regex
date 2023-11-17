import React from 'react';
import { Col, Container, Image, Row, Stack } from 'react-bootstrap';
import { BuildingFillGear, CardChecklist, MortarboardFill, Newspaper, PersonBadgeFill, PersonFill, PersonVcardFill, PersonVideo2, Server, TelephonePlusFill } from 'react-bootstrap-icons';

/* A simple component to render the landing page. */
const Infosec = () => (
  <Container>
    <Row>
      <Col className="col-9">
        <Stack gap={4}>
          <div className="gray-background"><Image src="/images/ok.png" className="p-3" /> All of our systems are currently operational</div>
          <Row>
            <Col className="col-2"><CardChecklist size="90" style={{ color: '#856404' }} /></Col>
            <Col className="col-10"><a href="https://hawaii.edu/its/covid-19-resources/">Distance Resources</a>
              <p>Teaching and Learning Remotely, Working Remotely, Video conferencing, Software Licenses</p>
            </Col>
          </Row>
          <Row>
            <Col className="col-2"><TelephonePlusFill size="90" style={{ color: '#856404' }} /></Col>
            <Col className="col-10"><a href="https://www.hawaii.edu/its/support-tools/">Support Tools</a>
              <p>Email Account Practices, Google@UH, Laulima, MyUH, Reset Password, Supported Software, UH Alert Emergency Notification, UH Username, Wireless Information, OVPIT/CIO procurement approval requests</p>
            </Col>
          </Row>
          <Row>
            <Col className="col-2"><Server size="90" style={{ color: '#856404' }} /></Col>
            <Col className="col-10"><a href="https://www.hawaii.edu/its/servers-data-center-storage-services/">Servers, Data Center & Storage Services</a>
              <p>Cabinet Technical Specifications, Colocation Services, Data Center Services, Quick Start Guide, Resources, Service Expectations, VM Hosted Solutions</p>
            </Col>
          </Row>
          <Row>
            <Col className="col-2"><PersonVideo2 size="90" style={{ color: '#856404' }} /></Col>
            <Col className="col-10"><a href="https://www.hawaii.edu/its/instructional-technology/">Instructional Technologies</a>
              <p>Computer Labs, Distance Learning, UH Online Innovation Center, Educational Cable Access, Video Conferencing, Laulima</p>
            </Col>
          </Row>
          <Row>
            <Col className="col-2"><BuildingFillGear size="90" style={{ color: '#856404' }} /></Col>
            <Col className="col-10"><a href="https://www.hawaii.edu/its/ci/">Cyberinfrastructure</a>
              <p>Collaborative Research, Data Management, High Performance Computing Resources, Research Data Storage, Research Software Engineering, Research Virtual Machines</p>
            </Col>
          </Row>
          <Row>
            <Col className="col-2"><Newspaper size="90" style={{ color: '#856404' }} /></Col>
            <Col className="col-10"><a href="https://www.hawaii.edu/its/category/news/">News & Information</a>
              <p>View the latest news and information in the Information Technology Services department.</p>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="col-2"><Image src="/images/banner-student-info-system.png" /></Col>
            <Col className="col-10"><h5>BANNER INFORMATION</h5>
              <br />
              <p>The Banner Student Information System is a database of student records and information maintained by the University of Hawaii.
                For information related to Banner, please go to the <a href="https://www.hawaii.edu/its/banner/">Banner Information</a> page.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="col-4"><Image src="/images/mfa-300x103.jpg" /></Col>
            <Col className="col-8"><h5>MULTI-FACTOR AUTHENTICATION (MFA)</h5>
              <br />
              <p>Multi-Factor Authentication (MFA) is an extra layer of protection on top of your UH Username and password.
                For device registration, go to the <a href="https://www.hawaii.edu/its/uhlogin/device-reg">UH Login Device Registration</a> page.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="col-2"><Image src="/images/smartphone-150x150.png" /></Col>
            <Col className="col-10"><h5>SIGN-UP FOR UH ALERTS</h5>
              <br />
              <p>Sign-up for <a href="https://www.hawaii.edu/alert/">UH Alert Emergency Notification</a>in the event of a natural,
                health or civil emergency. If you can’t sign-up, here are some <a href="https://www.hawaii.edu/askus/1363">troubleshooting</a> tips.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="col-2"><Image src="/images/green-office-furniture-leed-certification-5-150x150.jpg" /></Col>
            <Col className="col-10"><h5>IT CENTER IS CERTIFIED LEED GOLD</h5>
              <br />
              <p>The Leadership in Energy & Environmental Design (LEED) has certified the Information Technology Center with a Gold rating by the <a href="https://www.usgbc.org/">U.S. Green Building Council</a>.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="col-4"><Image src="/images/DashboardScreenshot-300x131-300x131.png" /></Col>
            <Col className="col-8"><h5>IT CENTER DASHBOARD</h5>
              <br />
              <p>Find out more <a href="https://www.hawaii.edu/its/leed-about-the-building/">about the building</a>,
                <a href="https://www.hawaii.edu/its/leed-about-the-building/building-sustainability-features/">building sustainability</a>
                <a href="https://www.hawaii.edu/its/leed-about-the-building/building-sustainability-features/">features</a>,
                <a href="https://www.hawaii.edu/its/leed-about-the-building/building-sustainability-strategies/">strategies</a>, and the
                <a href="https://www.hawaii.edu/its/leed-about-the-building/it-center-dashboard/">dashboard</a>.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="col-4"><h5>VIDEO TOUR THE IT CENTER</h5><Image src="/images/IT-Center-w-play-button-150x150.png" /></Col>
          </Row>
          <hr />
          <Row>
            <Col className="text-center">
              <MortarboardFill size="90" style={{ color: '#856404' }} />
              <br />
              <a href="https://www.hawaii.edu/its/technology-resources-for-students/">Students</a>
            </Col>
            <Col className="text-center">
              <PersonBadgeFill size="90" style={{ color: '#856404' }} />
              <br />
              <a href="https://www.hawaii.edu/its/technology-resources-for-faculty/">Faculty</a>
            </Col>
            <Col className="text-center">
              <PersonVcardFill size="90" style={{ color: '#856404' }} />
              <br />
              <a href="https://www.hawaii.edu/its/technology-resources-for-staff/">Staff</a>
            </Col>
            <Col className="text-center">
              <PersonFill size="90" style={{ color: '#856404' }} />
              <br />
              <a href="https://www.hawaii.edu/its/visitors/">Visitors</a>
            </Col>
          </Row>
        </Stack>
      </Col>
      <Col className="col-3">
        <Stack gap={4}>
          <div>
            <h4>Current & Recent Outages</h4>
            <a href="https://www.hawaii.edu/its/alerts/?t=1&id=263489">[RESOLVED] Online leave (https://www.hawaii.edu/leave) is unavailable (Nov 15)</a>
            <br />
            <br />
            <a href="https://www.hawaii.edu/its/alerts/?t=1&id=263532">[RESOLVED] Profiler may be unavailable (Nov 15)</a>
          </div>
          <div>
            <h4>Security Alerts</h4>
            <a href="https://www.hawaii.edu/its/alerts/?t=3&id=10378">Phishing Attempt: Office of the Dean - Important message</a>
            <br />
            <br />
            <a href="https://www.hawaii.edu/its/alerts/?t=3&id=10374">Security Alert: Multiple security vulnerabilities in the SoftEther VPN client</a>
          </div>
          <div>
            <h4>Scheduled Maintenance</h4>
            <a href="https://www.hawaii.edu/its/alerts/?t=2&id=20002">BANNER: Apply December 2023 Upgrade Bundle (Dec 2)</a>
            <br />
            <br />
            <a href="https://www.hawaii.edu/its/alerts/?t=2&id=19781">Scheduled Maintenance for apply.hawaii.edu (Jan 20)</a>
          </div>
          <div>
            <h4>General Notices</h4>
            <a href="https://www.hawaii.edu/its/alerts/?t=4&id=10376">Notice: End of support for macOS 11 (Big Sur)</a>
            <br />
            <br />
            <a href="https://www.hawaii.edu/its/alerts/?t=4&id=10365">Notice: macOS 14 (Sonoma) advisory</a>
          </div>
        </Stack>
      </Col>
    </Row>
  </Container>
);

export default Infosec;
