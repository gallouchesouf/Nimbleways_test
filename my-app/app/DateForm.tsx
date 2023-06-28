'use client';
import React, { ChangeEvent, Component, FormEvent } from 'react';
import axios from 'axios';

interface DateFormState {
    startDate: string;
    endDate: string;
    differenceInDays: number | null;
}

class DateForm extends Component<{}, DateFormState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            startDate: '',
            endDate: '',
            differenceInDays: null
        };
    }
    componentDidMount() {
        axios.get('http://localhost:3000/api/data')
            .then(response => {
                const dataFromAPI = response.data;
                this.setState({ startDate: dataFromAPI.startDate });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données de l\'API :', error);
            });
    }
    handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const startDate = event.target.value;
        const endDate = this.state.endDate;
        const differenceInDays = this.calculateDateDifference(startDate, endDate);

        this.setState({
            startDate,
            differenceInDays
        });
    };

    handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const startDate = this.state.startDate;
        const endDate = event.target.value;
        const differenceInDays = this.calculateDateDifference(startDate, endDate);

        this.setState({
            endDate,
            differenceInDays
        });
    };

    handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const { startDate, endDate } = this.state;
    };

    calculateDateDifference = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Vérifiez si les dates sont valides
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            const differenceInMilliseconds = Math.abs(end.getTime() - start.getTime());
            const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));
            return differenceInDays;
        }

        return null;
    };

    render() {
        const { startDate, endDate } = this.state;

        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Start Date:
                    <input type="date" value={startDate} onChange={this.handleStartDateChange} />
                </label>
                <br />
                <label>
                    End Date:
                    <input type="date" value={endDate} onChange={this.handleEndDateChange} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        );
    }
}


export default DateForm;
