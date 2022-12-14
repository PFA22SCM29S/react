/*
Goal of React:
  1. React will retrieve GitHub created and closed issues for a given repository and will display the bar-charts 
     of same using high-charts        
  2. It will also display the images of the forecasted data for the given GitHub repository and images are being retrieved from 
     Google Cloud storage
  3. React will make a fetch api call to flask microservice.
*/

// Import required libraries
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
// Import custom components
import BarCharts from "./BarCharts";
import LineCharts from "./LineCharts";
import Loader from "./Loader";
import { ListItemButton } from "@mui/material";
import StackBarCharts from "./StackBarCharts";

const drawerWidth = 240;
// List of GitHub repositories 
const repositories = [
  {
    key: "angular/angular",
    value: "Angular",
  },
  {
    key: "angular/angular-cli",
    value: "Angular-cli",
  },
  {
    key: "angular/material",
    value: "Angular Material",
  },
  {
    key: "d3/d3",
    value: "D3",
  },
  {
    key: "google/go-github",
    value: "GO Github"
  },
  {
    key: "SebastianM/angular-google-maps",
    value: "Google Maps"
  },
  {
    key: "facebook/react",
    value: "React",
  },
  {
    key: "tensorflow/tensorflow",
    value: "Tensorflow"
  },
  {
    key: "keras-team/keras",
    value: "Keras"
  },
  {
    key: "pallets/flask",
    value: "Flask"
  },
  {
    key:"golang/go",
    value: "Go"
  }
];

export default function Home() {
  /*
  The useState is a react hook which is special function that takes the initial 
  state as an argument and returns an array of two entries. 
  */
  /*
  setLoading is a function that sets loading to true when we trigger flask microservice
  If loading is true, we render a loader else render the Bar charts
  */
  const [loading, setLoading] = useState(true);
  /* 
  setRepository is a function that will update the user's selected repository such as Angular,
  Angular-cli, Material Design, and D3
  The repository "key" will be sent to flask microservice in a request body
  */
  const [repository, setRepository] = useState({
    key: "angular/angular",
    value: "Angular",
  });
  /*
  
  The first element is the initial state (i.e. githubRepoData) and the second one is a function 
  (i.e. setGithubData) which is used for updating the state.

  so, setGitHub data is a function that takes the response from the flask microservice 
  and updates the value of gitHubrepo data.
  */
  const [githubRepoData, setGithubData] = useState([]);
  // Updates the repository to newly selected repository
  const eventHandler = (repo) => {
    setRepository(repo);
  };

  /* 
  Fetch the data from flask microservice on Component load and on update of new repository.
  Everytime there is a change in a repository, useEffect will get triggered, useEffect inturn will trigger 
  the flask microservice 
  */
  React.useEffect(() => {
    // set loading to true to display loader
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Append the repository key to request body
      body: JSON.stringify({ repository: repository.key }),
    };

    /*
    Fetching the GitHub details from flask microservice
    The route "/api/github" is served by Flask/App.py in the line 53
    @app.route('/api/github', methods=['POST'])
    Which is routed by setupProxy.js to the
    microservice target: "your_flask_gcloud_url"
    */
    fetch("/api/github", requestOptions)
      .then((res) => res.json())
      .then(
        // On successful response from flask microservice
        (result) => {
          // On success set loading to false to display the contents of the resonse
          setLoading(false);
          // Set state on successfull response from the API
          setGithubData(result);
        },
        // On failure from flask microservice
        (error) => {
          // Set state on failure response from the API
          console.log(error);
          // On failure set loading to false to display the error message
          setLoading(false);
          setGithubData([]);
        }
      );
  }, [repository]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Application Header */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Timeseries Forecasting
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Left drawer of the application */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {/* Iterate through the repositories list */}
            {repositories.map((repo) => (
              <ListItem
                button
                key={repo.key}
                onClick={() => eventHandler(repo)}
                disabled={loading && repo.value !== repository.value}
              >
                <ListItemButton selected={repo.value === repository.value}>
                  <ListItemText primary={repo.value} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {/* Render loader component if loading is true else render charts and images */}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {/* Render linechart component for the issues for every Repo*/}
            <LineCharts
              title={`Line Chart for issues of ${repository.value} in last 2 years`}
              data={githubRepoData?.created}
            />
            {/* Render barchart component for a monthly created issues for a selected repositories*/}
            <BarCharts
              title={`Monthly Created Issues for ${repository.value} in last 2 years`}
              data={githubRepoData?.created}
            />
             {/* Render barchart component for stars for every repo*/}
             <BarCharts
              title={`Stars Count for ${repository.value} in last 2 years`}
              data={githubRepoData?.starCount}
            />
             {/* Render barchart component for fork for every repo*/}
            <BarCharts
              title={`Forks Count for ${repository.value} in last 2 years`}
              data={githubRepoData?.forkCount}
            />

            {/* Render barchart component for a weeklu closed issues for a selected repositories*/}
            <BarCharts
              title={`Weekly Closed Issues for ${repository.value} in last 2 years`}
              data={githubRepoData?.closed_week}
            />

            {/* Render StackedBarCharts component for the issues for every Repo*/}
            <StackBarCharts
              title={`Created and Closed Issues for ${repository.value} in last 2 years`}
              data={githubRepoData?.stacked}
            />      
             
            {/* Render barchart component for a monthly closed issues for a selected repositories*/}
            {/* <BarCharts
              title={`Monthly Closed Issues for ${repository.value} in last 2 years`}
              data={githubRepoData?.closed}
            /> */}
            <Divider
              sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
            />

            {/* Rendering general max days and month */}
            <div>
              <Typography variant="h5" component="div" gutterBottom>
              1.The day of the week maximum number of issues created: {githubRepoData?.max_issue_created_day} <br></br>
              2.The day of the week maximum number of issues closed: {githubRepoData?.max_issue_closed_day} <br></br>
              3.The month of the year that has maximum number of issues closed: {githubRepoData?.max_issue_close_month} <br></br>
              </Typography>
            </div>
            {/* Rendering Timeseries Forecasting of Created Issues using Tensorflow and
                Keras LSTM */}
            <div>
              <Typography variant="h5" component="div" gutterBottom>
                Timeseries Forecasting of Created Issues using Tensorflow and
                Keras LSTM based on past month
              </Typography>

              <div>
                <Typography component="h4">
                  Model Loss for Created Issues
                </Typography>
                {/* Render the model loss image for created issues */}
                <img
                  src={githubRepoData?.createdAtImageUrls?.model_loss_image_url}
                  alt={"Model Loss for Created Issues"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  LSTM Generated Data for Created Issues
                </Typography>
                {/* Render the LSTM generated image for created issues*/}
                <img
                  src={
                    githubRepoData?.createdAtImageUrls?.lstm_generated_image_url
                  }
                  alt={"LSTM Generated Data for Created Issues"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  All Issues Data for Created Issues
                </Typography>
                {/* Render the all issues data image for created issues*/}
                <img
                  src={
                    githubRepoData?.createdAtImageUrls?.all_issues_data_image
                  }
                  alt={"All Issues Data for Created Issues"}
                  loading={"lazy"}
                />
              </div>
            </div>
            {/* Rendering Timeseries Forecasting of Closed Issues using Tensorflow and
                Keras LSTM  */}
            <div>
              <Divider
                sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
              />
              <Typography variant="h5" component="div" gutterBottom>
                Timeseries Forecasting of Closed Issues using Tensorflow and
                Keras LSTM based on past month
              </Typography>

              <div>
                <Typography component="h4">
                  Model Loss for Closed Issues
                </Typography>
                {/* Render the model loss image for closed issues  */}
                <img
                  src={githubRepoData?.closedAtImageUrls?.model_loss_image_url}
                  alt={"Model Loss for Closed Issues"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  LSTM Generated Data for Closed Issues
                </Typography>
                {/* Render the LSTM generated image for closed issues */}
                <img
                  src={
                    githubRepoData?.closedAtImageUrls?.lstm_generated_image_url
                  }
                  alt={"LSTM Generated Data for Closed Issues"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  All Issues Data for Closed Issues
                </Typography>
                {/* Render the all issues data image for closed issues*/}
                <img
                  src={githubRepoData?.closedAtImageUrls?.all_issues_data_image}
                  alt={"All Issues Data for Closed Issues"}
                  loading={"lazy"}
                />
              </div>
            </div> 

            {/* Rendering Timeseries Forecasting of Pulls using Tensorflow and
                Keras LSTM  */}
            <div>
              <Divider
                sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
              />
              <Typography variant="h5" component="div" gutterBottom>
                Timeseries Forecasting of Pulls using Tensorflow and
                Keras LSTM based on past month
              </Typography>

              <div>
                <Typography component="h4">
                  Model Loss for Pulls
                </Typography>
                {/* Render the model loss image for closed issues  */}
                <img
                  src={githubRepoData?.PullsImageUrls?.model_loss_image_url}
                  alt={"Model Loss for Pulls"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  LSTM Generated Data for Pulls
                </Typography>
                {/* Render the LSTM generated image for closed issues */}
                <img
                  src={
                    githubRepoData?.PullsImageUrls?.lstm_generated_image_url
                  }
                  alt={"LSTM Generated Data for Pulls"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  All Issues Data for Pulls
                </Typography>
                {/* Render the all issues data image for closed issues*/}
                <img
                  src={githubRepoData?.PullsImageUrls?.all_issues_data_image}
                  alt={"All Issues Data for Pulls"}
                  loading={"lazy"}
                />
              </div>
            </div>

            {/* Rendering Timeseries Forecasting of Commits using Tensorflow and
                Keras LSTM  */}
            <div>
              <Divider
                sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
              />
              <Typography variant="h5" component="div" gutterBottom>
                Timeseries Forecasting of Commits using Tensorflow and
                Keras LSTM based on past month
              </Typography>

              <div>
                <Typography component="h4">
                  Model Loss for Commits
                </Typography>
                {/* Render the model loss image for closed issues  */}
                <img
                  src={githubRepoData?.CommitsImageUrls?.model_loss_image_url}
                  alt={"Model Loss for Commits"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  LSTM Generated Data for Pulls
                </Typography>
                {/* Render the LSTM generated image for closed issues */}
                <img
                  src={
                    githubRepoData?.CommitsImageUrls?.lstm_generated_image_url
                  }
                  alt={"LSTM Generated Data for Pulls"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  All Issues Data for Commits
                </Typography>
                {/* Render the all issues data image for closed issues*/}
                <img
                  src={githubRepoData?.CommitsImageUrls?.all_issues_data_image}
                  alt={"All Issues Data for Commits"}
                  loading={"lazy"}
                />
              </div>
            </div>

            {/* Rendering Timeseries Forecasting of Branches using Tensorflow and
                Keras LSTM  */}
            <div>
              <Divider
                sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
              />
              <Typography variant="h5" component="div" gutterBottom>
                Timeseries Forecasting of Branches using Tensorflow and
                Keras LSTM based on past month
              </Typography>

              <div>
                <Typography component="h4">
                  Model Loss for Branches
                </Typography>
                {/* Render the model loss image for closed issues  */}
                <img
                  src={githubRepoData?.BranchesImageUrls?.model_loss_image_url}
                  alt={"Model Loss for Branches"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  LSTM Generated Data for Branches
                </Typography>
                {/* Render the LSTM generated image for closed issues */}
                <img
                  src={
                    githubRepoData?.BranchesImageUrls?.lstm_generated_image_url
                  }
                  alt={"LSTM Generated Data for Branches"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  All Issues Data for Branches
                </Typography>
                {/* Render the all issues data image for closed issues*/}
                <img
                  src={githubRepoData?.BranchesImageUrls?.all_issues_data_image}
                  alt={"All Issues Data for Branches"}
                  loading={"lazy"}
                />
              </div>
            </div>

            {/* Rendering Timeseries Forecasting of Contributors using Tensorflow and
                Keras LSTM  */}
            <div>
              <Divider
                sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
              />
              <Typography variant="h5" component="div" gutterBottom>
                Timeseries Forecasting of Contributors using Tensorflow and
                Keras LSTM based on past month
              </Typography>

              <div>
                <Typography component="h4">
                  Model Loss for Contributors
                </Typography>
                {/* Render the model loss image for closed issues  */}
                <img
                  src={githubRepoData?.ContributorsImageUrls?.model_loss_image_url}
                  alt={"Model Loss for Contributors"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  LSTM Generated Data for Contributors
                </Typography>
                {/* Render the LSTM generated image for closed issues */}
                <img
                  src={
                    githubRepoData?.ContributorsImageUrls?.lstm_generated_image_url
                  }
                  alt={"LSTM Generated Data for Contributors"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  All Issues Data for Contributors
                </Typography>
                {/* Render the all issues data image for closed issues*/}
                <img
                  src={githubRepoData?.ContributorsImageUrls?.all_issues_data_image}
                  alt={"All Issues Data for Contributors"}
                  loading={"lazy"}
                />
              </div>
            </div>

            {/* Rendering Timeseries Forecasting of Releases using Tensorflow and
                Keras LSTM  */}
            <div>
              <Divider
                sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
              />
              <Typography variant="h5" component="div" gutterBottom>
                Timeseries Forecasting of Releases using Tensorflow and
                Keras LSTM based on past month
              </Typography>

              <div>
                <Typography component="h4">
                  Model Loss for Releases
                </Typography>
                {/* Render the model loss image for closed issues  */}
                <img
                  src={githubRepoData?.ReleasesImageUrls?.model_loss_image_url}
                  alt={"Model Loss for Releases"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  LSTM Generated Data for Releases
                </Typography>
                {/* Render the LSTM generated image for closed issues */}
                <img
                  src={
                    githubRepoData?.ReleasesImageUrls?.lstm_generated_image_url
                  }
                  alt={"LSTM Generated Data for Releases"}
                  loading={"lazy"}
                />
              </div>
              <div>
                <Typography component="h4">
                  All Issues Data for Releases
                </Typography>
                {/* Render the all issues data image for closed issues*/}
                <img
                  src={githubRepoData?.ReleasesImageUrls?.all_issues_data_image}
                  alt={"All Issues Data for Releases"}
                  loading={"lazy"}
                />
              </div>
            </div>

          </div>
        )}
      </Box>
    </Box>
  );
}
