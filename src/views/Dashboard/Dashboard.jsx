import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";
import jQuery from 'jquery';
import moment from 'moment';
import _ from 'lodash';

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";

class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bw3sec: '0',
      bw5min: '0',
      bwtotal: '0',
      lastupdate: 0,
      graphData: {
        labels: ["last refresh"],
        series: [
          [0],
          [0]
        ]
      },
      routerVersionPie: {
        labels: [],
        series: []
      }
    }
    this.updateDashboard()
    this.updateDashboard = this.updateDashboard.bind(this)
    setInterval(this.updateDashboard, 3000)
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  updateDashboard() {
    let self = this
    jQuery.get('/netdb', function(response) {
      let graphData = self.state.graphData
      let currentSpeed = jQuery(response).find('#sb_bandwidth > tbody > tr:nth-child(1) > td:nth-child(2)').html().replace('&nbsp;', ' ')
      let currentUpSpeed = parseFloat(currentSpeed.substring(0, currentSpeed.indexOf('/')))
      let currentDownSpeed = parseFloat(currentSpeed.substring(currentSpeed.indexOf('/')+2, currentSpeed.indexOf('KBps')))
      console.log(`Current up: ${currentUpSpeed} and down: ${currentDownSpeed}`)
      let currentSeries = {
        labels: [...graphData.labels, moment(new Date()).format('HH:mm:ss')],
        series: [
          graphData.series[0].concat(currentUpSpeed),
          graphData.series[1].concat(currentDownSpeed)
        ]
      }
      var dataPie = {
        labels: [],
        series: []
      }
      let routerVersions = jQuery(response).find('#netdbversions > tbody > tr').map((idx,value) => {
        let routerVersion = jQuery(value).find('a').html()
        let routerVersionCount = jQuery(value).find('td:nth-child(2)').html()
        dataPie.labels.push(routerVersion)
        dataPie.series.push(routerVersionCount)
      })

      dataPie.labels = dataPie.labels.filter(v => {
        if (v == undefined) return false
        return true
      })
      dataPie.series = dataPie.series.filter(v => {
        if (v == undefined) return false
        return true
      })

      self.setState({
        bw3sec: currentSpeed,
        bw5min: jQuery(response).find('#sb_bandwidth > tbody > tr:nth-child(2) > td:nth-child(2)').html().replace('&nbsp;', ' '),
        bwtotal: jQuery(response).find('#sb_bandwidth > tbody > tr:nth-child(3) > td:nth-child(2)').html().replace('&nbsp;', ' '),
        lastupdate: new Date(),
        graphData: currentSeries,
        routerVersionPie: dataPie
      })
      console.log(currentSeries)
    })
  }

  render() {
    console.log(this.state)
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-signal text-info" />}
                statsText="3 Sec"
                statsValue={this.state.bw3sec}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText={moment(this.state.lastupdate).fromNow()}
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-signal text-info" />}
                statsText="5 Min"
                statsValue={this.state.bw5min}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText={moment(this.state.lastupdate).fromNow()}
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-signal text-info" />}
                statsText="Total"
                statsValue={this.state.bwtotal}
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText={moment(this.state.lastupdate).fromNow()}
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Router Statistics"
                category="Realtime performance"
                stats="Updated 3 minutes ago"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={this.state.graphData}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Router types"
                category="Last Check Results"
                stats="Result compiled 2 days ago"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={this.state.routerVersionPie} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend({
                    names: this.state.routerVersionPie.labels,
                    types: ['info']
                  })}</div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="Something else"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
