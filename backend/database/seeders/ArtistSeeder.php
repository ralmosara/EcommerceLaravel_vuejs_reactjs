<?php

namespace Database\Seeders;

use App\Models\Artist;
use Illuminate\Database\Seeder;

class ArtistSeeder extends Seeder
{
    public function run(): void
    {
        $artists = [
            [
                'name' => 'Sex Pistols',
                'bio' => 'English punk rock band formed in London in 1975. They were responsible for initiating the punk movement in the United Kingdom and inspiring many later punk and alternative rock musicians.',
                'formed_year' => 1975,
                'origin' => 'London, England',
                'links' => ['https://en.wikipedia.org/wiki/Sex_Pistols'],
            ],
            [
                'name' => 'The Ramones',
                'bio' => 'American punk rock band that formed in New York City in 1974. Often cited as the first true punk rock group, the Ramones are credited with establishing the musical formula for punk rock.',
                'formed_year' => 1974,
                'origin' => 'New York City, USA',
                'links' => ['https://ramonesmusic.com'],
            ],
            [
                'name' => 'The Clash',
                'bio' => 'English rock band formed in London in 1976 as a key player in the original wave of British punk rock. They also contributed to the post-punk and new wave movements.',
                'formed_year' => 1976,
                'origin' => 'London, England',
                'links' => ['https://www.theclash.com'],
            ],
            [
                'name' => 'Dead Kennedys',
                'bio' => 'American punk rock band formed in San Francisco in 1978. Known for their provocative lyrics and satirical take on American culture and politics.',
                'formed_year' => 1978,
                'origin' => 'San Francisco, USA',
                'links' => ['https://deadkennedys.com'],
            ],
            [
                'name' => 'Black Flag',
                'bio' => 'American punk rock band formed in 1976 in Hermosa Beach, California. Initially called Panic, they are widely considered to be one of the first hardcore punk bands.',
                'formed_year' => 1976,
                'origin' => 'Los Angeles, USA',
                'links' => ['https://en.wikipedia.org/wiki/Black_Flag_(band)'],
            ],
            [
                'name' => 'Minor Threat',
                'bio' => 'American hardcore punk band formed in Washington, D.C. in 1980. They were one of the first bands associated with the straight edge subculture.',
                'formed_year' => 1980,
                'origin' => 'Washington, D.C., USA',
                'links' => ['https://www.dischord.com/band/minor-threat'],
            ],
            [
                'name' => 'Bad Religion',
                'bio' => 'American punk rock band that formed in Los Angeles in 1980. Known for their intelligent lyrics addressing political, social, and religious issues.',
                'formed_year' => 1980,
                'origin' => 'Los Angeles, USA',
                'links' => ['https://badreligion.com'],
            ],
            [
                'name' => 'Green Day',
                'bio' => 'American rock band formed in 1987. Originally part of the punk scene at the Berkeley club 924 Gilman Street, they became a major force in pop punk.',
                'formed_year' => 1987,
                'origin' => 'Berkeley, USA',
                'links' => ['https://greenday.com'],
            ],
            [
                'name' => 'NOFX',
                'bio' => 'American punk rock band formed in Los Angeles in 1983. Known for their irreverent humor, political commentary, and refusal to sign to a major label.',
                'formed_year' => 1983,
                'origin' => 'Los Angeles, USA',
                'links' => ['https://nofxofficialwebsite.com'],
            ],
            [
                'name' => 'Rancid',
                'bio' => 'American punk rock band formed in Berkeley, California in 1991. Known for their ska punk and street punk sound.',
                'formed_year' => 1991,
                'origin' => 'Berkeley, USA',
                'links' => ['https://rancid.com'],
            ],
            [
                'name' => 'The Offspring',
                'bio' => 'American rock band from Garden Grove, California, formed in 1984. Often credited alongside Green Day and Rancid for reviving mainstream interest in punk rock.',
                'formed_year' => 1984,
                'origin' => 'Garden Grove, USA',
                'links' => ['https://offspring.com'],
            ],
            [
                'name' => 'Misfits',
                'bio' => 'American punk rock band often recognized as the progenitors of the horror punk subgenre. Founded in 1977 in Lodi, New Jersey.',
                'formed_year' => 1977,
                'origin' => 'New Jersey, USA',
                'links' => ['https://misfits.com'],
            ],
            [
                'name' => 'Buzzcocks',
                'bio' => 'English punk rock band formed in Bolton in 1976, led by singer-songwriter Pete Shelley. They are commonly regarded as an important influence on the Manchester music scene.',
                'formed_year' => 1976,
                'origin' => 'Bolton, England',
                'links' => ['https://buzzcocks.com'],
            ],
            [
                'name' => 'Social Distortion',
                'bio' => 'American punk rock band formed in 1978 in Fullerton, California. Known for their hard-hitting blend of punk rock and rockabilly.',
                'formed_year' => 1978,
                'origin' => 'Fullerton, USA',
                'links' => ['https://socialdistortion.com'],
            ],
            [
                'name' => 'The Descendents',
                'bio' => 'American punk rock band formed in 1977 in Manhattan Beach, California. Considered one of the most influential punk rock bands.',
                'formed_year' => 1977,
                'origin' => 'Manhattan Beach, USA',
                'links' => ['https://descendents.com'],
            ],
        ];

        foreach ($artists as $artistData) {
            Artist::create($artistData);
        }
    }
}
