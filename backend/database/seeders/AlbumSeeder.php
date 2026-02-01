<?php

namespace Database\Seeders;

use App\Enums\AlbumFormat;
use App\Models\Album;
use App\Models\Artist;
use App\Models\Genre;
use Illuminate\Database\Seeder;

class AlbumSeeder extends Seeder
{
    public function run(): void
    {
        $artists = Artist::all()->keyBy('name');
        $genres = Genre::all()->keyBy('name');

        $albums = [
            // Sex Pistols
            [
                'artist' => 'Sex Pistols',
                'title' => 'Never Mind the Bollocks, Here\'s the Sex Pistols',
                'description' => 'The only studio album by the English punk rock band, released in 1977. It is considered one of the most influential albums in punk rock history.',
                'release_year' => 1977,
                'format' => AlbumFormat::VINYL,
                'price' => 34.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Sex+Pistols',
                'is_featured' => true,
                'genres' => ['Classic Punk Rock'],
                'tracks' => [
                    ['title' => 'Holidays in the Sun', 'duration' => 203],
                    ['title' => 'Bodies', 'duration' => 183],
                    ['title' => 'No Feelings', 'duration' => 162],
                    ['title' => 'Liar', 'duration' => 154],
                    ['title' => 'God Save the Queen', 'duration' => 200],
                    ['title' => 'Problems', 'duration' => 248],
                    ['title' => 'Seventeen', 'duration' => 130],
                    ['title' => 'Anarchy in the U.K.', 'duration' => 213],
                    ['title' => 'Submission', 'duration' => 257],
                    ['title' => 'Pretty Vacant', 'duration' => 199],
                    ['title' => 'New York', 'duration' => 203],
                    ['title' => 'E.M.I.', 'duration' => 183],
                ],
            ],

            // The Ramones
            [
                'artist' => 'The Ramones',
                'title' => 'Ramones',
                'description' => 'The debut studio album by American punk rock band the Ramones, released on April 23, 1976. It is considered one of the most influential punk rock albums of all time.',
                'release_year' => 1976,
                'format' => AlbumFormat::VINYL,
                'price' => 29.99,
                'sale_price' => 24.99,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Ramones',
                'is_featured' => true,
                'genres' => ['Classic Punk Rock'],
                'tracks' => [
                    ['title' => 'Blitzkrieg Bop', 'duration' => 130],
                    ['title' => 'Beat on the Brat', 'duration' => 153],
                    ['title' => 'Judy Is a Punk', 'duration' => 91],
                    ['title' => 'I Wanna Be Your Boyfriend', 'duration' => 143],
                    ['title' => 'Chain Saw', 'duration' => 116],
                    ['title' => 'Now I Wanna Sniff Some Glue', 'duration' => 88],
                    ['title' => '53rd & 3rd', 'duration' => 151],
                    ['title' => 'Let\'s Dance', 'duration' => 94],
                ],
            ],
            [
                'artist' => 'The Ramones',
                'title' => 'Road to Ruin',
                'description' => 'The fourth studio album, featuring a slightly more polished production and the classic "I Wanna Be Sedated".',
                'release_year' => 1978,
                'format' => AlbumFormat::CD,
                'price' => 14.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Road+to+Ruin',
                'is_featured' => false,
                'genres' => ['Classic Punk Rock'],
                'tracks' => [
                    ['title' => 'I Just Want to Have Something to Do', 'duration' => 159],
                    ['title' => 'I Wanted Everything', 'duration' => 199],
                    ['title' => 'Don\'t Come Close', 'duration' => 225],
                    ['title' => 'I Wanna Be Sedated', 'duration' => 150],
                    ['title' => 'Go Mental', 'duration' => 160],
                    ['title' => 'She\'s the One', 'duration' => 210],
                ],
            ],

            // The Clash
            [
                'artist' => 'The Clash',
                'title' => 'London Calling',
                'description' => 'The third studio album, widely considered one of the greatest albums of all time, blending punk with reggae, ska, and rockabilly.',
                'release_year' => 1979,
                'format' => AlbumFormat::VINYL,
                'price' => 39.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=London+Calling',
                'is_featured' => true,
                'genres' => ['Post-Punk', 'Ska Punk'],
                'tracks' => [
                    ['title' => 'London Calling', 'duration' => 199],
                    ['title' => 'Brand New Cadillac', 'duration' => 125],
                    ['title' => 'Jimmy Jazz', 'duration' => 214],
                    ['title' => 'Hateful', 'duration' => 164],
                    ['title' => 'Rudie Can\'t Fail', 'duration' => 207],
                    ['title' => 'Spanish Bombs', 'duration' => 198],
                    ['title' => 'The Right Profile', 'duration' => 235],
                    ['title' => 'Lost in the Supermarket', 'duration' => 223],
                    ['title' => 'Clampdown', 'duration' => 230],
                    ['title' => 'The Guns of Brixton', 'duration' => 191],
                    ['title' => 'Train in Vain', 'duration' => 193],
                ],
            ],
            [
                'artist' => 'The Clash',
                'title' => 'Combat Rock',
                'description' => 'The fifth studio album featuring the hit singles "Rock the Casbah" and "Should I Stay or Should I Go".',
                'release_year' => 1982,
                'format' => AlbumFormat::CD,
                'price' => 16.99,
                'sale_price' => 12.99,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Combat+Rock',
                'is_featured' => false,
                'genres' => ['Post-Punk'],
                'tracks' => [
                    ['title' => 'Know Your Rights', 'duration' => 223],
                    ['title' => 'Car Jamming', 'duration' => 242],
                    ['title' => 'Should I Stay or Should I Go', 'duration' => 191],
                    ['title' => 'Rock the Casbah', 'duration' => 223],
                    ['title' => 'Straight to Hell', 'duration' => 348],
                ],
            ],

            // Dead Kennedys
            [
                'artist' => 'Dead Kennedys',
                'title' => 'Fresh Fruit for Rotting Vegetables',
                'description' => 'The debut album of the American hardcore punk band, known for its biting political satire and aggressive sound.',
                'release_year' => 1980,
                'format' => AlbumFormat::VINYL,
                'price' => 27.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Fresh+Fruit',
                'is_featured' => true,
                'genres' => ['Hardcore Punk'],
                'tracks' => [
                    ['title' => 'Kill the Poor', 'duration' => 183],
                    ['title' => 'Forward to Death', 'duration' => 213],
                    ['title' => 'When Ya Get Drafted', 'duration' => 118],
                    ['title' => 'Let\'s Lynch the Landlord', 'duration' => 123],
                    ['title' => 'Drug Me', 'duration' => 101],
                    ['title' => 'Your Emotions', 'duration' => 98],
                    ['title' => 'Chemical Warfare', 'duration' => 115],
                    ['title' => 'California Über Alles', 'duration' => 202],
                    ['title' => 'Holiday in Cambodia', 'duration' => 235],
                ],
            ],

            // Black Flag
            [
                'artist' => 'Black Flag',
                'title' => 'Damaged',
                'description' => 'The debut studio album, widely considered a masterpiece of hardcore punk and one of the most influential punk albums.',
                'release_year' => 1981,
                'format' => AlbumFormat::VINYL,
                'price' => 26.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Damaged',
                'is_featured' => false,
                'genres' => ['Hardcore Punk'],
                'tracks' => [
                    ['title' => 'Rise Above', 'duration' => 144],
                    ['title' => 'Spray Paint', 'duration' => 31],
                    ['title' => 'Six Pack', 'duration' => 128],
                    ['title' => 'What I See', 'duration' => 102],
                    ['title' => 'TV Party', 'duration' => 147],
                    ['title' => 'Thirsty and Miserable', 'duration' => 90],
                    ['title' => 'Police Story', 'duration' => 101],
                    ['title' => 'Gimmie Gimmie Gimmie', 'duration' => 119],
                    ['title' => 'Depression', 'duration' => 242],
                    ['title' => 'Damaged I', 'duration' => 200],
                ],
            ],

            // Minor Threat
            [
                'artist' => 'Minor Threat',
                'title' => 'Complete Discography',
                'description' => 'Collection of all studio recordings from the pioneering straight edge hardcore band.',
                'release_year' => 1989,
                'format' => AlbumFormat::CD,
                'price' => 18.99,
                'sale_price' => 15.99,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Minor+Threat',
                'is_featured' => false,
                'genres' => ['Hardcore Punk', 'Straight Edge'],
                'tracks' => [
                    ['title' => 'Filler', 'duration' => 72],
                    ['title' => 'I Don\'t Wanna Hear It', 'duration' => 56],
                    ['title' => 'Seeing Red', 'duration' => 67],
                    ['title' => 'Straight Edge', 'duration' => 96],
                    ['title' => 'Small Man, Big Mouth', 'duration' => 64],
                    ['title' => 'Minor Threat', 'duration' => 118],
                    ['title' => 'Out of Step', 'duration' => 89],
                    ['title' => 'Salad Days', 'duration' => 139],
                ],
            ],

            // Bad Religion
            [
                'artist' => 'Bad Religion',
                'title' => 'Suffer',
                'description' => 'The third album that returned the band to a faster hardcore punk sound and is considered a landmark release.',
                'release_year' => 1988,
                'format' => AlbumFormat::VINYL,
                'price' => 25.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Suffer',
                'is_featured' => true,
                'genres' => ['Melodic Hardcore'],
                'tracks' => [
                    ['title' => 'You Are (The Government)', 'duration' => 95],
                    ['title' => '1000 More Fools', 'duration' => 101],
                    ['title' => 'How Much Is Enough?', 'duration' => 98],
                    ['title' => 'When?', 'duration' => 155],
                    ['title' => 'Give You Nothing', 'duration' => 125],
                    ['title' => 'Land of Competition', 'duration' => 132],
                    ['title' => 'Suffer', 'duration' => 124],
                    ['title' => 'What Can You Do?', 'duration' => 165],
                ],
            ],
            [
                'artist' => 'Bad Religion',
                'title' => 'No Control',
                'description' => 'Fourth album and follow-up to Suffer, cementing their place as melodic hardcore pioneers.',
                'release_year' => 1989,
                'format' => AlbumFormat::CD,
                'price' => 14.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=No+Control',
                'is_featured' => false,
                'genres' => ['Melodic Hardcore'],
                'tracks' => [
                    ['title' => 'Change of Ideas', 'duration' => 77],
                    ['title' => 'Big Bang', 'duration' => 114],
                    ['title' => 'No Control', 'duration' => 101],
                    ['title' => 'Sometimes I Feel Like', 'duration' => 76],
                    ['title' => 'Automatic Man', 'duration' => 90],
                    ['title' => 'I Want to Conquer the World', 'duration' => 134],
                ],
            ],

            // Green Day
            [
                'artist' => 'Green Day',
                'title' => 'Dookie',
                'description' => 'The third studio album that brought punk rock to mainstream audiences and became a cultural phenomenon.',
                'release_year' => 1994,
                'format' => AlbumFormat::CD,
                'price' => 13.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Dookie',
                'is_featured' => true,
                'genres' => ['Pop Punk'],
                'tracks' => [
                    ['title' => 'Burnout', 'duration' => 134],
                    ['title' => 'Having a Blast', 'duration' => 164],
                    ['title' => 'Chump', 'duration' => 174],
                    ['title' => 'Longview', 'duration' => 234],
                    ['title' => 'Welcome to Paradise', 'duration' => 225],
                    ['title' => 'Pulling Teeth', 'duration' => 150],
                    ['title' => 'Basket Case', 'duration' => 183],
                    ['title' => 'She', 'duration' => 134],
                    ['title' => 'Sassafras Roots', 'duration' => 159],
                    ['title' => 'When I Come Around', 'duration' => 178],
                ],
            ],
            [
                'artist' => 'Green Day',
                'title' => 'American Idiot',
                'description' => 'A punk rock opera that revitalized the band\'s career with political commentary and theatrical arrangements.',
                'release_year' => 2004,
                'format' => AlbumFormat::VINYL,
                'price' => 32.99,
                'sale_price' => 27.99,
                'cover_image' => 'https://via.placeholder.com/500x500?text=American+Idiot',
                'is_featured' => true,
                'genres' => ['Pop Punk', 'Alternative Punk'],
                'tracks' => [
                    ['title' => 'American Idiot', 'duration' => 178],
                    ['title' => 'Jesus of Suburbia', 'duration' => 548],
                    ['title' => 'Holiday', 'duration' => 232],
                    ['title' => 'Boulevard of Broken Dreams', 'duration' => 262],
                    ['title' => 'Are We the Waiting', 'duration' => 162],
                    ['title' => 'Wake Me Up When September Ends', 'duration' => 285],
                ],
            ],

            // NOFX
            [
                'artist' => 'NOFX',
                'title' => 'Punk in Drublic',
                'description' => 'The fifth studio album and the band\'s most successful release, blending humor with serious themes.',
                'release_year' => 1994,
                'format' => AlbumFormat::VINYL,
                'price' => 28.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Punk+in+Drublic',
                'is_featured' => false,
                'genres' => ['Pop Punk', 'Skate Punk'],
                'tracks' => [
                    ['title' => 'Linoleum', 'duration' => 141],
                    ['title' => 'Leave It Alone', 'duration' => 121],
                    ['title' => 'Dig', 'duration' => 81],
                    ['title' => 'The Cause', 'duration' => 130],
                    ['title' => 'Don\'t Call Me White', 'duration' => 169],
                    ['title' => 'My Heart Is Yearning', 'duration' => 163],
                    ['title' => 'Perfect Government', 'duration' => 130],
                    ['title' => 'The Brews', 'duration' => 183],
                ],
            ],

            // Rancid
            [
                'artist' => 'Rancid',
                'title' => '...And Out Come the Wolves',
                'description' => 'The third studio album that achieved mainstream success while maintaining punk credibility.',
                'release_year' => 1995,
                'format' => AlbumFormat::CD,
                'price' => 15.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Out+Come+Wolves',
                'is_featured' => true,
                'genres' => ['Ska Punk', 'Street Punk'],
                'tracks' => [
                    ['title' => 'Maxwell Murder', 'duration' => 107],
                    ['title' => 'The 11th Hour', 'duration' => 138],
                    ['title' => 'Roots Radicals', 'duration' => 166],
                    ['title' => 'Time Bomb', 'duration' => 155],
                    ['title' => 'Olympia WA.', 'duration' => 199],
                    ['title' => 'Ruby Soho', 'duration' => 164],
                    ['title' => 'Daly City Train', 'duration' => 202],
                    ['title' => 'Journey to the End of the East Bay', 'duration' => 189],
                ],
            ],

            // The Offspring
            [
                'artist' => 'The Offspring',
                'title' => 'Smash',
                'description' => 'The third studio album and best-selling independent label album of all time.',
                'release_year' => 1994,
                'format' => AlbumFormat::CD,
                'price' => 12.99,
                'sale_price' => 9.99,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Smash',
                'is_featured' => false,
                'genres' => ['Pop Punk', 'Skate Punk'],
                'tracks' => [
                    ['title' => 'Time to Relax', 'duration' => 25],
                    ['title' => 'Nitro (Youth Energy)', 'duration' => 152],
                    ['title' => 'Bad Habit', 'duration' => 223],
                    ['title' => 'Gotta Get Away', 'duration' => 231],
                    ['title' => 'Genocide', 'duration' => 214],
                    ['title' => 'Something to Believe In', 'duration' => 204],
                    ['title' => 'Come Out and Play', 'duration' => 189],
                    ['title' => 'Self Esteem', 'duration' => 257],
                ],
            ],

            // Misfits
            [
                'artist' => 'Misfits',
                'title' => 'Static Age',
                'description' => 'Recording sessions from 1978, finally released in 1997. Essential horror punk.',
                'release_year' => 1997,
                'format' => AlbumFormat::VINYL,
                'price' => 31.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Static+Age',
                'is_featured' => false,
                'genres' => ['Horror Punk'],
                'tracks' => [
                    ['title' => 'Static Age', 'duration' => 101],
                    ['title' => 'TV Casualty', 'duration' => 144],
                    ['title' => 'Some Kinda Hate', 'duration' => 122],
                    ['title' => 'Last Caress', 'duration' => 117],
                    ['title' => 'Return of the Fly', 'duration' => 88],
                    ['title' => 'Hybrid Moments', 'duration' => 103],
                    ['title' => 'We Are 138', 'duration' => 99],
                    ['title' => 'Attitude', 'duration' => 92],
                ],
            ],

            // Buzzcocks
            [
                'artist' => 'Buzzcocks',
                'title' => 'Singles Going Steady',
                'description' => 'Compilation of singles released between 1977 and 1979, considered one of the best punk compilations.',
                'release_year' => 1979,
                'format' => AlbumFormat::CD,
                'price' => 16.99,
                'sale_price' => 13.99,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Singles+Going+Steady',
                'is_featured' => false,
                'genres' => ['Classic Punk Rock'],
                'tracks' => [
                    ['title' => 'Orgasm Addict', 'duration' => 126],
                    ['title' => 'What Do I Get?', 'duration' => 169],
                    ['title' => 'I Don\'t Mind', 'duration' => 142],
                    ['title' => 'Love You More', 'duration' => 164],
                    ['title' => 'Ever Fallen in Love', 'duration' => 162],
                    ['title' => 'Promises', 'duration' => 188],
                    ['title' => 'Everybody\'s Happy Nowadays', 'duration' => 152],
                    ['title' => 'Harmony in My Head', 'duration' => 190],
                ],
            ],

            // Social Distortion
            [
                'artist' => 'Social Distortion',
                'title' => 'Social Distortion',
                'description' => 'The self-titled third album that brought the band mainstream success with their blend of punk and rockabilly.',
                'release_year' => 1990,
                'format' => AlbumFormat::VINYL,
                'price' => 29.99,
                'sale_price' => null,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Social+Distortion',
                'is_featured' => false,
                'genres' => ['Street Punk'],
                'tracks' => [
                    ['title' => 'So Far Away', 'duration' => 202],
                    ['title' => 'Let It Be Me', 'duration' => 195],
                    ['title' => 'Story of My Life', 'duration' => 221],
                    ['title' => 'Sick Boy', 'duration' => 257],
                    ['title' => 'Ring of Fire', 'duration' => 198],
                    ['title' => 'Ball and Chain', 'duration' => 257],
                ],
            ],

            // The Descendents
            [
                'artist' => 'The Descendents',
                'title' => 'Milo Goes to College',
                'description' => 'Debut album that defined the melodic hardcore sound and influenced countless bands.',
                'release_year' => 1982,
                'format' => AlbumFormat::VINYL,
                'price' => 26.99,
                'sale_price' => 22.99,
                'cover_image' => 'https://via.placeholder.com/500x500?text=Milo+Goes+to+College',
                'is_featured' => true,
                'genres' => ['Melodic Hardcore', 'Pop Punk'],
                'tracks' => [
                    ['title' => 'Myage', 'duration' => 101],
                    ['title' => 'I Wanna Be a Bear', 'duration' => 42],
                    ['title' => 'I\'m Not a Loser', 'duration' => 124],
                    ['title' => 'Parents', 'duration' => 85],
                    ['title' => 'Tony\'s Theme', 'duration' => 30],
                    ['title' => 'M-16', 'duration' => 91],
                    ['title' => 'I\'m Not a Punk', 'duration' => 78],
                    ['title' => 'Catalina', 'duration' => 67],
                    ['title' => 'Suburban Home', 'duration' => 103],
                    ['title' => 'Hope', 'duration' => 119],
                ],
            ],
        ];

        foreach ($albums as $albumData) {
            $artist = $artists->get($albumData['artist']);
            if (!$artist) {
                continue;
            }

            $tracks = $albumData['tracks'];
            $genreNames = $albumData['genres'];
            unset($albumData['artist'], $albumData['tracks'], $albumData['genres']);

            $album = Album::create([
                ...$albumData,
                'artist_id' => $artist->id,
            ]);

            // Attach genres
            $genreIds = [];
            foreach ($genreNames as $genreName) {
                $genre = $genres->get($genreName);
                if ($genre) {
                    $genreIds[] = $genre->id;
                }
            }
            $album->genres()->attach($genreIds);

            // Create tracks
            foreach ($tracks as $index => $trackData) {
                $album->tracks()->create([
                    'track_number' => $index + 1,
                    'title' => $trackData['title'],
                    'duration_seconds' => $trackData['duration'],
                ]);
            }
        }
    }
}
