async function main(){
  const base = 'http://localhost:3000';
  try{
    console.log('Creating grape type Malbec...');
    let r = await fetch(base + '/api/grapes', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name:'Malbec'})
    });
    const grape = await r.json().catch(()=>null);
    console.log('Grape response status', r.status, grape);

    console.log('Creating wine with public image URL...');
    const photoUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Red_wine.jpg';
    r = await fetch(base + '/api/wines', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({
      name: 'Prueba Malbec', year: 2018, description: 'Vino de prueba', grapeTypeName: 'Malbec', photos: [photoUrl]
    })
    });
    const wine = await r.json().catch(()=>null);
    console.log('Wine create status', r.status, wine);

    console.log('Querying wines...');
    r = await fetch(base + '/api/wines');
    const list = await r.json();
    console.log('Wines:', JSON.stringify(list, null, 2));
  }catch(e){
    console.error('Error during test flow:', e);
  }
}

main();
