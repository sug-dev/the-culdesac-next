type Listener = (state: { arr: number[]; attempts: number }) => void;

class BogoEngine {
    arr: number[]
    attempts: number
    listeners: Set<Listener>

    constructor(size = 10) {
        this.arr = this.randomArray(size)
        this.attempts = 0
        this.listeners = new Set()

        this.loop()
    }

    private randomArray(size: number) {
        return Array.from({ length: size }, (_, i) => i).sort(() => Math.random() - 0.5)
    }

    private isSorted() {
        for (let i = 1; i < this.arr.length; i++) {
            if (this.arr[i - 1] > this.arr[i]) return false
        }
        return true
    }

    private shuffle() {
        for (let i = this.arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.arr[i], this.arr[j]] = [this.arr[j], this.arr[i]]
        }
    }

    private emit() {
        const state = { arr: [...this.arr], attempts: this.attempts }
        this.listeners.forEach((l) => l(state))
    }

    subscribe(listener: Listener) {
        this.listeners.add(listener)

        // send current state immediately
        listener({ arr: this.arr, attempts: this.attempts })

        return () => this.listeners.delete(listener)
    }

    private loop() {
        setTimeout(() => {
            if (!this.isSorted()) {
                this.shuffle()
                this.attempts++
            }
            else {
                // reset to keep it running forever
                this.arr = this.randomArray(this.arr.length)
                this.attempts = 0
            }

            // throttle updates
            if (this.attempts % 1 === 0) {
                this.emit()
            }

            this.loop()
        }, 1000) // slow + continuous
    }
}

// 👇 global singleton
const globalForBogo = globalThis as unknown as {
    bogo?: BogoEngine
}

export const bogo = globalForBogo.bogo ?? (globalForBogo.bogo = new BogoEngine())