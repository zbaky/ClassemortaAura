class subject {
    constructor(name) {
        this.name = name;
        this.votes = [];
    }

    aggiungiVoto(voto) {
        if (typeof voto !== 'number' || Number.isNaN(voto)) throw new TypeError('Voto deve essere un numero');
        this.votes.push(voto);
    }

    rimuoviVoto(index) {
        if (index < 0 || index >= this.votes.length) throw new RangeError('Indice voto non valido');
        this.votes.splice(index, 1);
    }

    media() {
        if (this.votes.length === 0) return null;
        const sum = this.votes.reduce((a, b) => a + b, 0);
        return sum / this.votes.length;
    }
}

class student {
    constructor(id, name) {
        this.id = id;
        this.name = name || `Studente ${id}`;
        this.subjects = new Map(); // nome -> subject
    }

    aggiungiMateria(nomeMateria) {
        if (this.subjects.has(nomeMateria)) return this.subjects.get(nomeMateria);
        const s = new subject(nomeMateria);
        this.subjects.set(nomeMateria, s);
        return s;
    }

    rimuoviMateria(nomeMateria) {
        this.subjects.delete(nomeMateria);
    }

    getMateria(nomeMateria) {
        return this.subjects.get(nomeMateria) || null;
    }

    mediaMateria(nomeMateria) {
        const m = this.getMateria(nomeMateria);
        if (!m) return null;
        return m.media();
    }

    mediaTotale() {
        const medie = [];
        for (const m of this.subjects.values()) {
            const a = m.media();
            if (a !== null) medie.push(a);
        }
        if (medie.length === 0) return null;
        const sum = medie.reduce((x, y) => x + y, 0);
        return sum / medie.length;
    }
}

class register {
    constructor() {
        this.students = new Map(); 
        this.currentUserId = null;
    }

    inserisciUtente(id, name) {
        if (this.students.has(id)) throw new Error('Utente già esistente');
        const s = new student(id, name);
        this.students.set(id, s);
        if (this.currentUserId === null) this.currentUserId = id;
        return s;
    }

    cambiaUtente(id) {
        if (!this.students.has(id)) throw new Error('Utente non trovato');
        this.currentUserId = id;
        return this.getUtenteCorrente();
    }

    getUtenteCorrente() {
        if (this.currentUserId === null) return null;
        return this.students.get(this.currentUserId) || null;
    }
}

const registro = new register();
registro.inserisciUtente('u1', 'Alice');
registro.inserisciUtente('u2', 'Bob');
registro.cambiaUtente('u1');
const alice = registro.getUtenteCorrente();
alice.aggiungiMateria('Matematica');
const matematica = alice.getMateria('Matematica');
matematica.aggiungiVoto(8);
matematica.aggiungiVoto(7.5);
console.log('Media Matematica Alice:', alice.mediaMateria('Matematica'));
console.log('Media Totale Alice:', alice.mediaTotale());
