class subject {
    constructor(name) {
        this.name = name;
        this.votes = [];
    }

    aggiungiVoto(voto) {
        if (typeof voto !== 'number' || Number.isNaN(voto)) throw new TypeError('Voto deve essere un numero');
        if (voto < 1 || voto > 10) throw new RangeError('Voto deve essere compreso tra 1 e 10');
        this.votes.push(voto);
    }

    rimuoviVoto(index) {
        if (index < 0 || index >= this.votes.length) throw new RangeError('Indice voto non valido');
        this.votes.splice(index, 1);
    }

    media() {
        if (this.votes.length === 0) return null;
        const sum = this.votes.reduce((a, b) => a + b, 0);
        return (sum / this.votes.length) / 2;
    }
}

class student {
    constructor(id, name, surname) {
        this.id = id;
        this.name = name || `Studente ${id}`;
        this.surname = surname || `Studente ${id}`;
        this.subjects = new Map();
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
        return (sum / medie.length)*2;
    }
}

class register {
    constructor() {
        this.students = new Map();
        this.currentUserId = null;
    }

    inserisciUtente(id, name, surname) {
        if (this.students.has(id)) throw new Error('Utente già esistente');
        const s = new student(id, name, surname);
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
registro.inserisciUtente('u1', 'Alice', 'Rossi');
registro.inserisciUtente('u2', 'Bob', 'Verdi');
registro.cambiaUtente('u1');

function calcolaMedia() {
    const mediaElement = document.getElementById('mediaVoti');
    if (!mediaElement) return null;

    const utente = registro.getUtenteCorrente();
    if (!utente) {
        mediaElement.textContent = '0';
        return 0;
    }

    const media = utente.mediaTotale();
    const valore = media === null ? 0 : Number(media);
    mediaElement.textContent = valore.toFixed(2);
    return valore;
}

function Invia() {
    const votoInput = document.getElementById('voto');
    const materiaInput = document.getElementById('materia');
    const listaVoti = document.getElementById('listaVoti');

    if (!votoInput || !materiaInput || !listaVoti) return;

    const voto = Number(votoInput.value);
    const materia = materiaInput.value.trim();

    if (!materia || Number.isNaN(voto) || voto < 1 || voto > 10) {
        return;
    }

    const utente = registro.getUtenteCorrente();
    if (!utente) return;

    const materiaObj = utente.aggiungiMateria(materia);
    materiaObj.aggiungiVoto(voto);

    const newRow = document.createElement('div');
    newRow.className = 'row mb-2 border rounded p-2';
    newRow.innerHTML = `
        <div class="col">
            <input type="text" class="form-control" value="${voto}" disabled>
        </div>
        <div class="col">
            <input type="text" class="form-control" value="${materia}" disabled>
        </div>
    `;

    listaVoti.appendChild(newRow);
    votoInput.value = '';
    materiaInput.value = '';
    calcolaMedia();
}

if (document.getElementById('formVoti')) {
    document.getElementById('formVoti').addEventListener('submit', function (event) {
        event.preventDefault();
        Invia();
    });
}

if (document.getElementById('mediaVoti')) {
    calcolaMedia();
}
