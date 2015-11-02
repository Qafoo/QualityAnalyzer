import React from 'react'

import Model from './dependencies/model.js'
import Chart from './dependencies/chart.js'

let Dependencies = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
    },

    getInitialState: function () {
        return {
            leaves: [],
            initialized: false,
        }
    },

    componentDidMount: function () {
        Chart.create(this.getChartElement(), this.unfoldLeave, this.getChartState())
    },

    componentDidUpdate: function () {
        Chart.update(this.getChartElement(), this.getChartState())
    },

    componentWillUnmount: function () {
        Chart.destroy(this.getChartElement())
    },

    getChartElement: function () {
        return document.getElementById('dependency-chart')
    },

    getChartState: function () {
        if (!this.state.initialized) {
            this.model.calculateDependencyTree(this.props.data.analyzers.dependencies.dependencies)

            this.setState({
                leaves: this.model.getLeaves(),
                initialized: true,
            })
        }

        return {
            leaves: this.state.leaves,
            links: this.model.calculateDependencies(this.state.leaves),
        }
    },

    unfoldLeave: function (leave) {
        this.model.findAndUnfold(leave.id)
        this.setState({
            leaves: this.model.getLeaves(),
        })
    },

    model: new Model(),

    render: function () {
        return (<div className="row">
            <div className="col-md-12">
                <div id="dependency-chart"></div>
            </div>
        </div>)
    },
})

export default Dependencies
