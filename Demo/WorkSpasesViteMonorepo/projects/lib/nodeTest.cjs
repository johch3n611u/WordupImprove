// node nodeTest.cjs
(function() {
    const fs = require('fs').promises;
    
    const path = require('path');
  
    var name = 'replaceme';
  
    async function main() {
        const data = await fs.readFile(
            path.join(__dirname, 'src', 'components', 'index.tsx'), 
            { encoding: 'utf-8' }
        );

        console.log(data);

        const s = data.split('\n');
  
        console.log(s);

        for (let x of s.reverse()) {
            if (x.includes('export default')) {
                name = x.replace('export default ', '').replace(" ", "");
                console.log(name);
            }
        };

        console.log(name);
    }
  
    main();
  })();