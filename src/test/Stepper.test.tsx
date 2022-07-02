import { describe, expect, it } from 'vitest';

import Stepper from '../components/Stepper';
import { render, screen, userEvent } from './utils';

describe('Stepper', () => {
    it('Shows initial value correctly', () => {
        render(<Stepper initialValue={3} />);

        const display = screen.getByRole('textbox', { name: /display/i });

        expect(display).toHaveDisplayValue('3');
    });

    it('Allows to increment/decrement', () => {
        render(<Stepper />);

        const display = screen.getByRole('textbox', { name: /display/i });
        const increment = screen.getByRole('button', { name: /increment/i });
        const decrement = screen.getByRole('button', { name: /decrement/i });

        expect(display).toHaveDisplayValue('0');

        userEvent.click(increment);
        expect(display).toHaveDisplayValue('1');

        userEvent.click(decrement);
        expect(display).toHaveDisplayValue('0');

        userEvent.click(decrement);
        expect(display).toHaveDisplayValue('-1');
    });

    it("Doesn't allow to move out of the upperbound", () => {
        render(<Stepper maxValue={2} />);

        const display = screen.getByRole('textbox', { name: /display/i });
        const increment = screen.getByRole('button', { name: /increment/i });

        expect(display).toHaveDisplayValue('0');

        userEvent.click(increment); // 1
        userEvent.click(increment); // 2
        userEvent.click(increment); // 3
        expect(display).toHaveDisplayValue('2');
    });

    it("Doesn't allow to move out of the lowerbound", () => {
        render(<Stepper minValue={0} />);

        const display = screen.getByRole('textbox', { name: /display/i });
        const decrement = screen.getByRole('button', { name: /decrement/i });

        expect(display).toHaveDisplayValue('0');

        userEvent.click(decrement); // -1
        userEvent.click(decrement); // -2
        expect(display).toHaveDisplayValue('0');
    });

    it('Allows to move using an step', () => {
        render(<Stepper step={6} />);

        const display = screen.getByRole('textbox', { name: /display/i });
        const increment = screen.getByRole('button', { name: /increment/i });
        const decrement = screen.getByRole('button', { name: /decrement/i });

        expect(display).toHaveDisplayValue('0');

        userEvent.click(increment); // 6
        expect(display).toHaveDisplayValue('6');

        userEvent.click(decrement); // 0
        userEvent.click(decrement); // -6
        expect(display).toHaveDisplayValue('-6');
    });

    it("Doesn't allow to move out of the upperbound using an step", () => {
        render(<Stepper maxValue={5} step={6} />);

        const display = screen.getByRole('textbox', { name: /display/i });
        const increment = screen.getByRole('button', { name: /increment/i });

        expect(display).toHaveDisplayValue('0');

        userEvent.click(increment); // 0
        expect(display).toHaveDisplayValue('0');
    });

    it("Doesn't allow to move out of the lowerbound using an step", () => {
        render(<Stepper minValue={-7} step={6} />);

        const display = screen.getByRole('textbox', { name: /display/i });
        const decrement = screen.getByRole('button', { name: /decrement/i });

        expect(display).toHaveDisplayValue('0');

        userEvent.click(decrement); // -6
        expect(display).toHaveDisplayValue('-6');
    });
});
