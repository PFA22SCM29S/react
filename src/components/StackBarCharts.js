import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Refer the high charts "https://github.com/highcharts/highcharts-react" for more information

const StackBarCharts = (props) => {
  const config = {
    chart: {
      type: "column",
    },
    title: {
      text: props.title,
    },
    xAxis: {
      type: "category",
      labels: {
        style: {
          fontSize: "13px",
          fontFamily: "Verdana, sans-serif",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Issues",
      }
    ,
    stackLabels: {
      enabled: true,
      style: {
        fontWeight: 'bold',
        color: ( // theme
          Highcharts.defaultOptions.title.style &&
          Highcharts.defaultOptions.title.style.color
        ) || 'gray',
        textOutline: 'none'
      }
    }
  }
    ,
    legend: {
      align: 'left',
      x: 70,
      verticalAlign: 'top',
      y: 70,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    tooltip: {
      pointFormat: "Issues: <b>{point.y} </b>",
    },
    series: props.data,
  };
  return (
    <div>
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={config}
        ></HighchartsReact>
      </div>
    </div>
  );
};

export default StackBarCharts;
