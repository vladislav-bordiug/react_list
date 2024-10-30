import { screen, within, render } from '@testing-library/react'
import App from './App'
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import Card from './Components/Card'
import '@testing-library/jest-dom';
const fs = require('fs').promises;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Components', () => {
    let mockData: string;
    let mockData2: string;

    beforeEach(async () => {
        const data = await fs.readFile('./src/mock.txt', 'utf-8');
        mockData = data.toString();
        const data2 = await fs.readFile('./src/mock2.txt', 'utf-8');
        mockData2 = data2.toString();
        jest.clearAllMocks();
        global.fetch = jest.fn(() =>
            Promise.resolve({
              text: () => mockData,
            })
        ) as jest.Mock;
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Checks loading and cards + loading cards after scrolling', async () => {
        render(<App />)
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
        const spinner = screen.getByTestId('spinner');
        expect(spinner).toBeInTheDocument();
        await wait(1000);
        const initialCards = screen.getAllByTestId('card');
        expect(initialCards).toHaveLength(10);
        window.scrollY = document.documentElement.scrollHeight;
        act(() => {
            window.dispatchEvent(new Event('scroll'));
        });
        await wait(1500);
        const initialCards2 = screen.getAllByTestId('card');
        expect(initialCards2).toHaveLength(20);
    }, 10000)

    test('Checks deleting element', async () => {
        render(<App />)
        await wait(2000);
        const initialCards = screen.getAllByTestId('card');
        expect(initialCards).toHaveLength(10);
        const nameElement = within(initialCards[0]).getAllByRole('heading', { level: 4 })[0].textContent;
        if (nameElement){
            expect(screen.queryByText(new RegExp(nameElement, 'i'))).toBeInTheDocument();
        }
        else{
            throw new Error('No text found in the document.');
        }
        const deletebtn = within(initialCards[0]).getByTestId('delete');
        userEvent.click(deletebtn);
        await wait(1000);
        const initialCards2 = screen.getAllByTestId('card');
        expect(initialCards2).toHaveLength(10);
        expect(screen.queryByText(new RegExp(nameElement, 'i'))).not.toBeInTheDocument();
    })

    test('Checks changing sorting direction', async () => {
        render(<App />)
        await wait(1000);
        const initialCards = screen.getAllByTestId('card');
        expect(initialCards).toHaveLength(10);
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        text: () => Promise.resolve(mockData2),
                    });
                }, 1000);
            })
        );
        const changedir = screen.getByTestId('changedirection');
        expect(changedir).toBeInTheDocument();
        userEvent.click(changedir);
        await wait(100);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
        const spinner = screen.getByTestId('spinner');
        expect(spinner).toBeInTheDocument();
        await wait(1000);
        const initialCards2 = screen.getAllByTestId('card');
        expect(initialCards2).toHaveLength(10);
    })

    test('Checks changing element', async () => {
        render(<App />)
        await wait(1000);
        const initialCards = screen.getAllByTestId('card');
        expect(initialCards).toHaveLength(10);
        const changebtn = within(initialCards[0]).getByTestId('change');
        userEvent.click(changebtn);
        await wait(100);
        const name = within(initialCards[0]).getByTestId('inputname');
        userEvent.type(name, 'Hello, World!');
        await wait(250);
        const genre = within(initialCards[0]).getByTestId('inputgenre');
        userEvent.type(genre, 'Hello, World...');
        await wait(250);
        userEvent.click(changebtn);
        await wait(100);
        expect(screen.getByText(/Hello, World!/i)).toBeInTheDocument();
        expect(screen.getByText(/Hello, World.../i)).toBeInTheDocument();
    })

    test('Checks changing sorting', async () => {
        render(<App />)
        await wait(1000);
        const initialCards = screen.getAllByTestId('card');
        expect(initialCards).toHaveLength(10);
        const options = ['rating', 'alphabetical', 'popularity', 'ranking'];
        for (let i = 0; i < options.length; i++) {
            (global.fetch as jest.Mock).mockImplementationOnce(() =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            text: () => Promise.resolve(( i % 2 == 0) ? mockData2: mockData),
                        });
                    }, 1000);
                })
            );
            const dropdown = screen.getByText(new RegExp(options[i > 0 ? i-1 : options.length-1], 'i'));
            userEvent.click(dropdown);
            const option = await screen.findByTestId(options[i]);
            userEvent.click(option);
            await wait(100);
            expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
            const spinner = screen.getByTestId('spinner');
            expect(spinner).toBeInTheDocument();
            await wait(1000);
            const initialCards2 = screen.getAllByTestId('card');
            expect(initialCards2).toHaveLength(10);
        }
    }, 10000)

    test('Checks card', async () => {
        render(<Card 
        name = "The Shawshank Redemption" 
        image = "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg" 
        rating = {9.3} 
        contentRating='16+' 
        genre='Drama' 
        url='https://www.imdb.com/title/tt0111161/' 
        id={0}
        />)
        expect(screen.getByText(/The Shawshank Redemption/i)).toBeInTheDocument();
        const imageSrc = 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg';
        const image = screen.getByAltText("The Shawshank Redemption");
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', imageSrc);
        expect(screen.getByText(/9.3/i)).toBeInTheDocument();
        expect(screen.getByText(/16+/i)).toBeInTheDocument();
        expect(screen.getByText(/Drama/i)).toBeInTheDocument();
        const url = screen.getByText(/IMDb/i);
        const urlSrc = 'https://www.imdb.com/title/tt0111161/';
        expect(url).toHaveAttribute('href', urlSrc);
    })
})