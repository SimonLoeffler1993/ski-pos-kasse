import ArtikelKarte from "./artikelkarte";


type ArtikelgridProps = {
    kategorie: string;
};

export default function ArtikelListe({ kategorie }: ArtikelgridProps) {

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            <p>{kategorie}</p>
                <ArtikelKarte
                    key={1}
                    name={"Testartikel"}
                    preis={19.99}
                    onHinzufuegen={() => {}}
                />
        </div>
    );
}